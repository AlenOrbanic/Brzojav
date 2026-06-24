/**
Pravi/odrzava jedan RTCPeerConnection po (drugom) korisniku.
Otvara RTCDataChannel za prijenos poruka i fileova direktno
između dva browsera. Signaling ide preko postojeceg Socket.IO
kanala (event: "webrtc-signal") — server samo prosljeđuje
pakete, ne čita sadržaj.
 */

const ICE_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

// state
let _socket = null;
let _me = null;
const _peers = new Map();     // username -> { pc, dc, ready, pendingICE: [], makingOffer, polite }
const _msgHandlers = [];

function _emit(toUsername, fromUsername, payload) {
  for (const h of _msgHandlers) {
    try { h(fromUsername, payload); } catch (e) { console.error('[p2p] handler error:', e); }
  }
}

function _getOrCreatePeer(otherUsername) {
  let peer = _peers.get(otherUsername);
  if (peer) return peer;

  const pc = new RTCPeerConnection(ICE_CONFIG);
  // "polite" peer: tko ima leksikografski "manje" ime, taj popušta u glare-u
  const polite = (_me < otherUsername);

  peer = { pc, dc: null, ready: false, pendingICE: [], makingOffer: false, polite };
  _peers.set(otherUsername, peer);

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      _socket?.emit('webrtc-signal', {
        to: otherUsername,
        data: { type: 'ice', candidate: e.candidate },
      });
    }
  };

  pc.onconnectionstatechange = () => {
    if (['failed', 'closed', 'disconnected'].includes(pc.connectionState)) {
      // očisti — sljedeći ensureConnection ce probati ponovno
      try { pc.close(); } catch (e) { /* ignore */ }
      _peers.delete(otherUsername);
    }
  };

  pc.ondatachannel = (e) => {
    _attachDataChannel(otherUsername, e.channel);
  };

  // negotiationneeded — kad mi prvi krenemo
  pc.onnegotiationneeded = async () => {
    try {
      peer.makingOffer = true;
      await pc.setLocalDescription();
      _socket?.emit('webrtc-signal', {
        to: otherUsername,
        data: { type: 'sdp', sdp: pc.localDescription },
      });
    } catch (err) {
      console.warn('[p2p] negotiation error:', err);
    } finally {
      peer.makingOffer = false;
    }
  };

  return peer;
}

function _attachDataChannel(otherUsername, channel) {
  const peer = _peers.get(otherUsername);
  if (!peer) return;
  peer.dc = channel;
  channel.binaryType = 'arraybuffer';

  // Reassembly buffera za binarne chunkove (per-transferId)
  const binBuffers = new Map(); // transferId -> { meta, chunks:[] }
  peer._binBuffers = binBuffers;

  channel.onopen = () => {
    peer.ready = true;
  };
  channel.onclose = () => {
    peer.ready = false;
  };
  channel.onerror = (e) => {
    console.warn('[p2p] dc error:', e.message || e);
  };
  channel.onmessage = (ev) => {
    // text frame = JSON kontrolna poruka; binary = file chunk bytes
    if (typeof ev.data === 'string') {
      let msg;
      try { msg = JSON.parse(ev.data); }
      catch { return; }
      // file metadata + EOF
      if (msg.__binMeta) {
        binBuffers.set(msg.transferId, { meta: msg.__binMeta, chunks: [] });
        return;
      }
      if (msg.__binEnd) {
        const entry = binBuffers.get(msg.transferId);
        if (!entry) return;
        const blob = new Blob(entry.chunks, { type: entry.meta.type || 'application/octet-stream' });
        binBuffers.delete(msg.transferId);
        _emit(otherUsername, otherUsername, {
          kind: 'file-complete',
          transferId: msg.transferId,
          meta: entry.meta,
          blob,
        });
        return;
      }
      // obicna kontrolna/text poruka
      _emit(otherUsername, otherUsername, msg);
      return;
    }
    // binary chunk — pripiši najnovijem otvorenom transferId
    // očekuje se interleavano slanje po transferu
    // Header: prvi 16 bajtova = ASCII transferId padded; ostatak = data
    const view = new Uint8Array(ev.data);
    const headerLen = 16;
    const idBytes = view.slice(0, headerLen);
    const transferId = new TextDecoder().decode(idBytes).replace(/\0+$/, '');
    const dataPart = view.slice(headerLen);
    const entry = binBuffers.get(transferId);
    if (entry) entry.chunks.push(dataPart);
  };
}

async function _ensureChannel(otherUsername) {
  const peer = _getOrCreatePeer(otherUsername);
  if (peer.dc && peer.ready) return peer;
  if (!peer.dc) {
    // mi smo inicijatori — kreiramo data channel
    const dc = peer.pc.createDataChannel('brzojav', { ordered: true });
    _attachDataChannel(otherUsername, dc);
  }
  return peer;
}

async function _handleSignal(fromUsername, data) {
  const peer = _getOrCreatePeer(fromUsername);
  const pc = peer.pc;

  try {
    if (data.type === 'sdp') {
      const description = data.sdp;
      const offerCollision =
        description.type === 'offer' &&
        (peer.makingOffer || pc.signalingState !== 'stable');

      if (offerCollision && !peer.polite) {
        return;
      }

      await pc.setRemoteDescription(description);
      // primijeni pending ICE kandidate
      for (const c of peer.pendingICE) {
        try { await pc.addIceCandidate(c); } catch (e) { /* ignore */ }
      }
      peer.pendingICE = [];

      if (description.type === 'offer') {
        await pc.setLocalDescription();
        _socket?.emit('webrtc-signal', {
          to: fromUsername,
          data: { type: 'sdp', sdp: pc.localDescription },
        });
      }
    } else if (data.type === 'ice') {
      if (pc.remoteDescription && pc.remoteDescription.type) {
        try { await pc.addIceCandidate(data.candidate); } catch (e) { /* ignore */ }
      } else {
        peer.pendingICE.push(data.candidate);
      }
    }
  } catch (err) {
    console.warn('[p2p] signal handle error:', err);
  }
}

// public

function init(socket, myUsername) {
  _socket = socket;
  _me = myUsername;
  socket.on('webrtc-signal', ({ from, data }) => {
    if (!from || !data) return;
    _handleSignal(from, data);
  });
}

async function ensureConnection(otherUsername) {
  if (!otherUsername || otherUsername === _me) return null;
  return _ensureChannel(otherUsername);
}

function isOpen(otherUsername) {
  const peer = _peers.get(otherUsername);
  return !!(peer && peer.dc && peer.ready);
}

function onMessage(handler) {
  _msgHandlers.push(handler);
}

// Pošalji JSON kontrolnu poruku. Vraća true ako je uspjelo.
function sendJSON(otherUsername, payload) {
  const peer = _peers.get(otherUsername);
  if (!peer || !peer.ready || !peer.dc) return false;
  try {
    peer.dc.send(JSON.stringify(payload));
    return true;
  } catch (e) {
    console.warn('[p2p] sendJSON failed:', e);
    return false;
  }
}

// Pošalji binary file u chunkovima.
async function sendFile(otherUsername, transferId, blobOrBuffer, meta = {}) {
  const peer = _peers.get(otherUsername);
  if (!peer || !peer.ready || !peer.dc) return false;
  const dc = peer.dc;
  const CHUNK = 16 * 1024;
  const HEADER_LEN = 16;

  // 16 bajtova header
  const idBytes = new TextEncoder().encode(String(transferId).slice(0, HEADER_LEN));
  const header = new Uint8Array(HEADER_LEN);
  header.set(idBytes);

  // meta first
  dc.send(JSON.stringify({ __binMeta: meta, transferId }));

  const buf = blobOrBuffer instanceof Blob
    ? await blobOrBuffer.arrayBuffer()
    : blobOrBuffer;
  const bytes = new Uint8Array(buf);

  for (let off = 0; off < bytes.byteLength; off += CHUNK) {
    while (dc.bufferedAmount > 4 * 1024 * 1024) {
      await new Promise(r => setTimeout(r, 30));
    }
    const slice = bytes.slice(off, off + CHUNK);
    const frame = new Uint8Array(HEADER_LEN + slice.byteLength);
    frame.set(header, 0);
    frame.set(slice, HEADER_LEN);
    dc.send(frame.buffer);
  }

  dc.send(JSON.stringify({ __binEnd: true, transferId }));
  return true;
}

function closeAll() {
  for (const [, peer] of _peers) {
    try { peer.dc?.close(); } catch (e) { /* ignore */ }
    try { peer.pc?.close(); } catch (e) { /* ignore */ }
  }
  _peers.clear();
}

export default {
  init,
  ensureConnection,
  isOpen,
  onMessage,
  sendJSON,
  sendFile,
  closeAll,
};
