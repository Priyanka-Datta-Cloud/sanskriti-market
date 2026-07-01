const Wishlist = {
  items: new Set(),

  async init() {
    if (!Auth.isLoggedIn()) return;
    try {
      const response = await api.wishlist.get();
      this.items = new Set((response.data.wishlist?.products || []).map((p) => p._id || p));
      this.updateBadge();
    } catch {}
  },

  updateBadge() {
    const badge = document.getElementById('wishlist-count');
    if (badge) {
      badge.textContent = this.items.size;
      badge.style.display = this.items.size > 0 ? 'flex' : 'none';
    }
  },

  isInWishlist(productId) {
    return this.items.has(productId);
  },

  async toggle(productId, btn) {
    if (!Auth.isLoggedIn()) {
      window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    try {
      if (this.isInWishlist(productId)) {
        await api.wishlist.remove(productId);
        this.items.delete(productId);
        if (btn) btn.classList.remove('active');
        Utils.showToast('Removed from wishlist', 'success');
      } else {
        await api.wishlist.add(productId);
        this.items.add(productId);
        if (btn) btn.classList.add('active');
        Utils.showToast('Added to wishlist!', 'success');
      }
      this.updateBadge();
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  },

  async remove(productId) {
    try {
      await api.wishlist.remove(productId);
      this.items.delete(productId);
      this.updateBadge();
      if (typeof renderWishlist === 'function') renderWishlist();
      Utils.showToast('Removed from wishlist', 'success');
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  },
};

window.Wishlist = Wishlist;
