/**
 *  - registriramo usera na node prilikom logina i govorimo na kojem portu korisnik sluša P2P poruke
 *  - šaljemo heartbeat svakih 60s da bi se održala registracija aktivnom
 *  - tražimo IP drugih korisnika po usernameu
 *  - Graceful logout
 */

// Hardcoded nodes
const SEED_NODES = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];

const HEARTBEAT_INTERVAL_MS = 60_000;

let _heartbeatTimer = null;

// Probaj svaki seed node redom dok jedan ne odgovori
async function trySeeds(path, opts = {}) {
  let lastError;
  for (const base of SEED_NODES) {
    try {
      const res = await fetch(`${base}${path}`, {
        ...opts,
        headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
        signal: AbortSignal.timeout?.(5000),
      });

      // Node je ziv ali vraća gresku — logiraj ali nastavi dalje
      if (res.status >= 500) {
        lastError = new Error(`${base} returned ${res.status}`);
        console.warn(`[seedClient] ${base} unhealthy: ${res.status}`);
        continue;
      }

      return res; // healthy response (2xx, 3xx, or 4xx)
    } catch (err) {
      lastError = err;
      console.warn(`[seedClient] ${base} unreachable: ${err.message}`);
    }
  }
  throw new Error(`All seed nodes unreachable. Last error: ${lastError?.message}`);
}

// Public API

/**
 * Registriramo korisnika na nodeu kod početka sesije
 */
async function register(username, p2pPort = 9000) {
  const res  = await trySeeds('/api/users/register', {
    method: 'POST',
    body:   JSON.stringify({ username, p2pPort }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Registration failed');

  _startHeartbeat(username);

  console.log(`[seedClient] Registered as "${username}"`, data.record);
  return data.record;
}

/**
 * Look up usera kroz cluster.
 */
async function lookup(username) {
  const res  = await trySeeds(`/api/lookup/${encodeURIComponent(username)}`);
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `User "${username}" not found`);
  }
  return data.record;
}

async function logout(username) {
  _stopHeartbeat();
  const user = username || _currentUser;
  _currentUser = null;

  if (!user) return; // nothing to log out

  try {
    await trySeeds('/api/users/logout', {
      method: 'POST',
      body:   JSON.stringify({ username: user }),
    });
  } catch (err) {
    // TTL briše record nakon 5 minuta od zadnjeg heartbeat-a
    console.warn(
      `[seedClient] Logout request failed for "${user}": ${err.message}. ` +
      `Record will expire via TTL.`
    );
  }
}

function _startHeartbeat(username) {
  _stopHeartbeat();
  _heartbeatTimer = setInterval(async () => {
    try {
      await trySeeds('/api/users/heartbeat', {
        method: 'POST',
        body:   JSON.stringify({ username }),
      });
    } catch (err) {
      console.warn(`[seedClient] Heartbeat failed: ${err.message}`);
    }
  }, HEARTBEAT_INTERVAL_MS);
}

function _stopHeartbeat() {
  if (_heartbeatTimer) {
    clearInterval(_heartbeatTimer);
    _heartbeatTimer = null;
  }
}

export default { register, lookup, logout };
