// Sanskriti Market — Auth helpers
const Auth = {
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('sm_user') || 'null'); } catch { return null; }
  },
  isLoggedIn: () => !!localStorage.getItem('sm_token'),
  getToken: () => localStorage.getItem('sm_token'),
  setSession: (user, token) => {
    if (user) localStorage.setItem('sm_user', JSON.stringify(user));
    if (token) localStorage.setItem('sm_token', token);
  },
  clearSession: () => {
    localStorage.removeItem('sm_user');
    localStorage.removeItem('sm_token');
  },
  async logout() {
    try { await API.post('/api/auth/logout'); } catch (e) {}
    Auth.clearSession();
    window.location.href = '/';
  },
  requireLogin(redirectBack = true) {
    if (!Auth.isLoggedIn()) {
      const back = redirectBack ? '?redirect=' + encodeURIComponent(location.pathname) : '';
      window.location.href = '/login.html' + back;
      return false;
    }
    return true;
  },
  async register(name, email, password, role) {
    const res = await API.post('/api/auth/register', { name, email, password, role });
    if (res.token) Auth.setSession(res.user, res.token);
    return res;
  },
  async login(email, password) {
    const res = await API.post('/api/auth/login', { email, password });
    if (res.token) Auth.setSession(res.user, res.token);
    return res;
  },
  // Call this on every page to update navbar
  updateNavbar() {
    try {
      const user = Auth.getUser();
      const token = Auth.getToken();
      if (!user || !token) return;

      // Hide login/join buttons
      const authSection = document.getElementById('nav-auth-section') || document.getElementById('nav-auth');
      if (authSection) authSection.style.display = 'none';

      // Show user section
      const userSection = document.getElementById('nav-user-section') || document.getElementById('nav-user');
      if (userSection) {
        userSection.style.display = 'flex';
        userSection.style.alignItems = 'center';
        userSection.style.gap = '12px';
      }

      // Set username
      const usernameEl = document.getElementById('nav-username');
      if (usernameEl) usernameEl.textContent = 'Hi, ' + (user.name || '').split(' ')[0] + ' 👋';

    } catch (e) { console.error('Navbar update error', e); }
  }
};

// Auto update navbar on every page load
document.addEventListener('DOMContentLoaded', () => Auth.updateNavbar());
