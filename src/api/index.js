const BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function getUser() {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

async function request(path, opts = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  return handleResponse(res);
}
async function handleResponse(res) {
  const data = await res.json();

  // Token expired or invalid — force logout
  if (res.status === 401) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

// Auth

export const auth = {
  async login(identifier, password) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  async register(username, email, password, phone = '') {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, phone }),
    });
  },
};

export const chats = {
  // Get all chats for the logged-in user
  async getAll() {
    return request('/api/chats');
  },

  // Get or create a direct chat with another user
  async getOrCreate(username) {
    return request('/api/chats', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },

  // Create group
  async createGroup(name, members) {
    return request('/api/chats/group', {
      method: 'POST',
      body: JSON.stringify({ name, members }),
    });
  },

  // Update group name or avatar
  async updateGroup(chatId, updates) {
    return request(`/api/chats/${chatId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Leave ili delete group
  async leave(chatId) {
    return request(`/api/chats/${chatId}/leave`, {
      method: 'POST',
    });
  },

  // Kick member
  async kickMember(chatId, username) {
    return request(`/api/chats/${chatId}/kick`, {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },
  async setNickname(chatId, nickname) {
  return request(`/api/chats/${chatId}`, {
    method: 'PATCH',
    body: JSON.stringify({ nickname }),
  });
},

  // Označi chat kao pročitan (postavi server-side lastReadAt = now)
  async markRead(chatId) {
    return request(`/api/chats/${chatId}/read`, { method: 'POST' });
  },
};

// Messages

export const messages = {
  // Get messages for a chat (newest last)
  async getAll(chatId, limit = 50, before = null) {
    const params = new URLSearchParams({ limit });
    if (before) params.set('before', before);
    return request(`/api/messages/${chatId}?${params}`);
  },

  // Send message
  async send(chatId, { text = '', replyTo = null, files = [], clientId = null } = {}) {
    const token = getToken();
    const form  = new FormData();

    form.append('text', text);
    if (replyTo) form.append('replyTo', JSON.stringify(replyTo));
    if (clientId) form.append('clientId', clientId);

    for (const f of files) {
      if (f.blob) form.append('files', f.blob, f.name);
    }

    const res = await fetch(`${BASE_URL}/api/messages/${chatId}`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    form,
    });

    return handleResponse(res);
  },

  // Delete message
  async delete(messageId) {
    return request(`/api/messages/${messageId}`, {
      method: 'DELETE',
    });
  },

  // Add reaction
  async react(messageId, emoji) {
    return request(`/api/messages/${messageId}/react`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    });
  },

  // Remove reaction
  async unreact(messageId) {
    return request(`/api/messages/${messageId}/react`, {
      method: 'DELETE',
    });
  },
};

// Users

export const users = {
  // Moj profil
  async getMe() {
    return request('/api/auth/me');
  },

  // Update profile
  async updateMe(updates) {
    return request('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Lookup po usernameu
  async lookup(username) {
    return request(`/api/auth/lookup/${encodeURIComponent(username)}`);
  },
  
  async changePassword(oldPassword, newPassword) {
    return request('/api/auth/password', {
      method: 'PATCH',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },

  async blockUser(username, block) {
    return request('/api/auth/block', {
      method: 'POST',
      body: JSON.stringify({ username, block }),
    });
  },
  async deleteMe() {
    return request('/api/auth/me', { method: 'DELETE' });
  },
};

export const links = {
  async preview(url) {
    const encoded = encodeURIComponent(url);
    return request(`/api/links/preview?url=${encoded}`);
  },
};
export { getToken, getUser };
export default { auth, chats, messages, users, links, getToken, getUser };