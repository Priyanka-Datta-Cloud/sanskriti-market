const API_BASE = window.location.origin + '/api';

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
  },

  products: {
    getAll: (params = '') => api.get(`/products${params ? '?' + params : ''}`),
    getBySlug: (slug) => api.get(`/products/slug/${slug}`),
    getStory: (productId) => api.get(`/products/story/${productId}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    createStory: (data) => api.post('/products/story', data),
  },

  cart: {
    get: () => api.get('/cart'),
    add: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
    update: (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity }),
    remove: (itemId) => api.delete(`/cart/item/${itemId}`),
    clear: () => api.delete('/cart/clear'),
  },

  wishlist: {
    get: () => api.get('/wishlist'),
    add: (productId) => api.post('/wishlist/add', { productId }),
    remove: (productId) => api.delete(`/wishlist/${productId}`),
    check: (productId) => api.get(`/wishlist/check/${productId}`),
  },

  orders: {
    create: (data) => api.post('/orders', data),
    getAll: (params = '') => api.get(`/orders${params ? '?' + params : ''}`),
    getById: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  },

  stores: {
    getAll: (params = '') => api.get(`/stores${params ? '?' + params : ''}`),
    getBySlug: (slug) => api.get(`/stores/slug/${slug}`),
    getMy: () => api.get('/stores/my'),
    update: (data) => api.put('/stores/my', data),
  },

  search: {
    query: (q, type = 'all') => api.get(`/search?q=${encodeURIComponent(q)}&type=${type}`),
    categories: () => api.get('/search/categories'),
  },

  ai: {
    chat: (message, history = []) => api.post('/ai/chat', { message, history }),
    recommendations: () => api.get('/ai/recommendations'),
    trending: () => api.get('/ai/trending'),
    featured: () => api.get('/ai/featured'),
    generateStory: (data) => api.post('/ai/generate-story', data),
  },

  seller: {
    dashboard: () => api.get('/seller/dashboard'),
    products: () => api.get('/seller/products'),
    orders: () => api.get('/seller/orders'),
  },

  admin: {
    dashboard: () => api.get('/admin/dashboard'),
    users: (params = '') => api.get(`/admin/users${params ? '?' + params : ''}`),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    products: (params = '') => api.get(`/admin/products${params ? '?' + params : ''}`),
    toggleFeatured: (id) => api.put(`/admin/products/${id}/featured`),
    orders: (params = '') => api.get(`/admin/orders${params ? '?' + params : ''}`),
  },
};

window.api = api;
