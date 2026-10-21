// Client-side presence: live online/last-active status + activity heartbeat.

const PING_EVERY_MS    = 25000;           // how often we tell the server "still here"
const ACTIVE_WINDOW_MS = 10 * 60 * 1000;  // no mouse/keyboard for this long = idle, stop pinging
const ACTIVITY_EVENTS  = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'];

let _socket = null;
const _status   = new Map();   // username -> { online, lastSeen, hidden }
const _subs     = new Set();
const _handlers = [];

let _pingTimer    = null;
let _lastActivity = Date.now();
let _lastSent     = 0;

// ---------- heartbeat ----------

function _canPing() {
  // a background tab still counts as "here" until the user has been idle for ACTIVE_WINDOW_MS
  return !!_socket && _socket.connected &&
    (Date.now() - _lastActivity) < ACTIVE_WINDOW_MS;
}

function _ping() {
  if (!_canPing()) return;
  const now = Date.now();
  if (now - _lastSent < 3000) return;   // throttle bursts
  _lastSent = now;
  _socket.emit('presence-ping');
}

function _markActive() {
  const wasIdle = (Date.now() - _lastActivity) >= ACTIVE_WINDOW_MS;
  _lastActivity = Date.now();
  if (wasIdle) _ping();                 // back from idle: tell the server right away
}

function _onVisibility() {
  if (document.visibilityState === 'visible') _markActive();   // user came back to the tab
}

function _startHeartbeat() {
  _stopHeartbeat();
  _lastActivity = Date.now();
  ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, _markActive, { passive: true }));
  window.addEventListener('scroll', _markActive, { passive: true, capture: true });
  document.addEventListener('visibilitychange', _onVisibility);
  window.addEventListener('focus', _onVisibility);
  _pingTimer = setInterval(_ping, PING_EVERY_MS);
  _ping();
}

function _stopHeartbeat() {
  clearInterval(_pingTimer);
  _pingTimer = null;
  ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, _markActive));
  window.removeEventListener('scroll', _markActive, { capture: true });
  document.removeEventListener('visibilitychange', _onVisibility);
  window.removeEventListener('focus', _onVisibility);
}

// ---------- status tracking ----------

function _apply(list) {
  if (!Array.isArray(list)) return;
  for (const s of list) _status.set(s.username, s);
  _handlers.forEach(h => h(list));
}

function _subscribe() {
  if (!_socket || !_subs.size) return;
  const url = _socket.io && _socket.io.uri;
  let answered = false;
  const timer = setTimeout(() => {
    if (!answered) {
      console.warn('[presence] NO ANSWER to presence-subscribe from', url,
        '- the backend at that address is not running the new index.js (or it errored: check ITS console).');
    }
  }, 4000);
  _socket.emit('presence-subscribe', [..._subs], (list) => {
    answered = true;
    clearTimeout(timer);
    console.info('[presence] got', Array.isArray(list) ? list.length : list, 'statuses from', url, list);
    _apply(list);
  });
}

export function init(socket) {
  _socket = socket;
  socket.on('presence', (s) => _apply([s]));
  socket.on('connect', () => { _subscribe(); _ping(); });   // rooms are lost on reconnect, so resubscribe
  _subscribe();
  _startHeartbeat();
}

export function watch(usernames) {    // call with the people you want live status for
  let added = false;
  for (const u of usernames) {
    if (typeof u !== 'string' || !u) continue;
    const k = u.replace(/^@/, '').toLowerCase();
    if (!_subs.has(k)) { _subs.add(k); added = true; }
  }
  if (added) _subscribe();
}

// returns an unsubscribe function
export function onPresence(h) {
  _handlers.push(h);
  return () => {
    const i = _handlers.indexOf(h);
    if (i !== -1) _handlers.splice(i, 1);
  };
}

// call on logout / component unmount
export function reset() {
  _stopHeartbeat();
  _socket = null;
  _status.clear();
  _subs.clear();
  _handlers.length = 0;
}

export const getStatus = (u) => _status.get(String(u || '').replace(/^@/, '').toLowerCase());

// ---------- formatting ----------

// "just now", "9m ago", "3h ago", "2d ago"  (short)  /  "9 minutes ago" ... (long)
export function timeAgo(date, short = false) {
  const t = new Date(date).getTime();
  if (!t) return '';
  const mins = Math.floor(Math.max(0, Date.now() - t) / 60000);
  if (mins < 1) return 'just now';
  const hrs  = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  const fmt = (n, s, l) => (short ? `${n}${s} ago` : `${n} ${l}${n === 1 ? '' : 's'} ago`);
  if (mins < 60) return fmt(mins, 'm', 'minute');
  if (hrs < 24)  return fmt(hrs, 'h', 'hour');
  return fmt(days, 'd', 'day');
}

export function statusText(s, short = false) {
  if (!s || s.hidden) return '';
  if (s.online) return 'Online';
  if (!s.lastSeen) return '';
  const ago = timeAgo(s.lastSeen, short);
  return ago ? `Active ${ago}` : '';
}

// debug helper: type __presence() in the browser console
if (typeof window !== 'undefined') {
  window.__presence = () => ({
    connected: !!(_socket && _socket.connected),
    backend: _socket && _socket.io ? _socket.io.uri : null,
    subscribedTo: [..._subs],
    status: Object.fromEntries(_status),
    idleForSec: Math.round((Date.now() - _lastActivity) / 1000),
  });
}

export default { init, watch, onPresence, reset, getStatus, statusText, timeAgo };