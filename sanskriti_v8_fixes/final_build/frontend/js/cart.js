const Cart = {
  count: 0,

  async init() {
    if (!Auth.isLoggedIn()) {
      this.count = parseInt(localStorage.getItem('guestCartCount') || '0');
      this.updateBadge();
      return;
    }
    try {
      const response = await api.cart.get();
      this.count = response.data.cart?.items?.length || 0;
      this.updateBadge();
    } catch {}
  },

  updateBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = this.count;
      badge.style.display = this.count > 0 ? 'flex' : 'none';
    }
  },

  async add(productId, quantity = 1) {
    if (!Auth.isLoggedIn()) {
      window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    try {
      await api.cart.add(productId, quantity);
      this.count++;
      this.updateBadge();
      Utils.showToast('Added to cart!', 'success');
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  },

  async remove(itemId) {
    try {
      await api.cart.remove(itemId);
      await this.init();
      Utils.showToast('Removed from cart', 'success');
      if (typeof renderCart === 'function') renderCart();
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  },

  async update(itemId, quantity) {
    try {
      await api.cart.update(itemId, quantity);
      if (typeof renderCart === 'function') renderCart();
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  },
};

window.Cart = Cart;
