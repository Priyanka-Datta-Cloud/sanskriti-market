const Utils = {
  formatPrice(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast-sanskriti ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },

  renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) html += '<i class="bi bi-star-fill"></i>';
      else if (i === full && half) html += '<i class="bi bi-star-half"></i>';
      else html += '<i class="bi bi-star"></i>';
    }
    return html;
  },

  renderProductCard(product) {
    const image = product.images?.[0]?.url || '';
    const storeName = product.store?.name || 'Artisan Store';
    const isWishlisted = Wishlist.isInWishlist(product._id);
    const comparePrice = product.comparePrice
      ? `<span class="compare">${this.formatPrice(product.comparePrice)}</span>`
      : '';

    return `
      <div class="product-card fade-in-up hover-lift">
        <a href="/product-detail.html?slug=${product.slug}" class="text-decoration-none text-dark">
          <div class="product-card-image">
            <img src="${image}" alt="${product.name}" loading="lazy" width="400" height="400">
            ${product.isFeatured ? '<span class="product-card-badge">Featured</span>' : ''}
            <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
              onclick="event.preventDefault(); Wishlist.toggle('${product._id}', this)" aria-label="Add to wishlist">
              <i class="bi bi-heart${isWishlisted ? '-fill' : ''}"></i>
            </button>
          </div>
          <div class="product-card-body">
            <div class="product-card-store">${storeName}</div>
            <h3 class="product-card-title">${product.name}</h3>
            <div class="product-card-price">${this.formatPrice(product.price)} ${comparePrice}</div>
            <div class="product-rating">
              ${this.renderStars(product.rating || 0)}
              <span class="text-muted ms-1">(${product.reviewCount || 0})</span>
            </div>
          </div>
        </a>
      </div>
    `;
  },

  renderProductGrid(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!products || products.length === 0) {
      container.innerHTML = '<div class="empty-state col-12"><i class="bi bi-box"></i><h4>No products found</h4></div>';
      return;
    }
    container.innerHTML = products.map((p) => this.renderProductCard(p)).join('');
  },

  initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
  },

  initNavbar() {
    const navbar = document.querySelector('.navbar-sanskriti');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      });
    }
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach((link) => {
      if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });
  },

  getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },
};

window.Utils = Utils;

document.addEventListener('DOMContentLoaded', async () => {
  Utils.initNavbar();
  Utils.initScrollReveal();
  await Cart.init();
  await Wishlist.init();
  Search.initSearchBar();
});
