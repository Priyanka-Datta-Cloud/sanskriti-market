const Auth = {
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('sm_user') || 'null');
    } catch { return null; }
  },
  isLoggedIn: () => !!localStorage.getItem('sm_token'),
  getToken: () => localStorage.getItem('sm_token'),
  setSession: (user, token) => {
    localStorage.setItem('sm_user', JSON.stringify(user));
    if (token) localStorage.setItem('sm_token', token);
  },
  clearSession: () => {
    localStorage.removeItem('sm_user');
    localStorage.removeItem('sm_token');
  },
  async logout() {
    try { await API.post('/api/auth/logout'); } catch {}
    Auth.clearSession();
    window.location.href = '/';
  },
  requireLogin(redirectBack = true) {
    if (!Auth.isLoggedIn()) {
      const back = redirectBack
        ? `?redirect=${encodeURIComponent(location.pathname)}`
        : '';
      window.location.href = '/login.html' + back;
      return false;
    }
    return true;
  },
  async register(name, email, password, role) {
    const res = await API.post('/api/auth/register', {
      name, email, password, role
    });
    if (res.token) Auth.setSession(res.user, res.token);
    return res;
  },
  async login(email, password) {
    const res = await API.post('/api/auth/login', {
      email, password
    });
    if (res.token) Auth.setSession(res.user, res.token);
    return res;
  },
};