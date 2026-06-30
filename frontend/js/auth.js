const Auth = {
  user: null,

  init() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        this.user = JSON.parse(userData);
      } catch {
        this.logout();
      }
    }
    this.updateUI();
  },

  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  getUser() {
    return this.user;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  async login(email, password) {
    const response = await api.auth.login({ email, password });
    this.setSession(response.data.token, response.data.user);
    return response;
  },

  async register(name, email, password, role = 'customer') {
    const response = await api.auth.register({ name, email, password, role });
    this.setSession(response.data.token, response.data.user);
    return response;
  },

  setSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    this.updateUI();
  },

  async logout() {
    try {
      await api.auth.logout();
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user = null;
    this.updateUI();
    window.location.href = '/login.html';
  },

  requireAuth(redirectUrl = '/login.html') {
    if (!this.isLoggedIn()) {
      window.location.href = redirectUrl + '?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  },

  requireRole(role, redirectUrl = '/') {
    if (!this.requireAuth()) return false;
    if (this.user.role !== role && this.user.role !== 'admin') {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  updateUI() {
    const loginBtn = document.getElementById('nav-login');
    const userMenu = document.getElementById('nav-user-menu');
    const userName = document.getElementById('nav-user-name');
    const sellerLink = document.getElementById('nav-seller');
    const adminLink = document.getElementById('nav-admin');

    if (this.isLoggedIn() && this.user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';
      if (userName) userName.textContent = this.user.name;
      if (sellerLink) sellerLink.style.display = this.user.role === 'seller' ? 'block' : 'none';
      if (adminLink) adminLink.style.display = this.user.role === 'admin' ? 'block' : 'none';
    } else {
      if (loginBtn) loginBtn.style.display = 'block';
      if (userMenu) userMenu.style.display = 'none';
      if (sellerLink) sellerLink.style.display = 'none';
      if (adminLink) adminLink.style.display = 'none';
    }
  },

  getRedirectUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || '/';
  },
};

document.addEventListener('DOMContentLoaded', () => Auth.init());
window.Auth = Auth;
