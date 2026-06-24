// Auth helpers
const Auth = {
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('sm_user') || 'null'); } catch { return null; }
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
      const back = redirectBack ? `?redirect=${encodeURIComponent(location.pathname)}` : '';
      window.location.href = '/login.html' + back;
      return false;
    }
    return true;
  },
};
