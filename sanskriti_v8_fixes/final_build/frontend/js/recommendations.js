const Recommendations = {
  async loadFeatured(containerId = 'featured-products') {
    try {
      const response = await api.ai.featured();
      Utils.renderProductGrid(response.data.products, containerId);
    } catch {
      this.showFallback(containerId);
    }
  },

  async loadTrending(containerId = 'trending-products') {
    try {
      const response = await api.ai.trending();
      Utils.renderProductGrid(response.data.products, containerId);
    } catch {
      this.showFallback(containerId);
    }
  },

  async loadPersonalized(containerId = 'recommended-products') {
    try {
      const response = await api.ai.recommendations();
      Utils.renderProductGrid(response.data.products, containerId);

      const insights = response.data.aiInsights;
      const insightsEl = document.getElementById('ai-insights');
      if (insightsEl && insights?.length) {
        insightsEl.innerHTML = insights.map((r) => `
          <div class="alert alert-light border mb-2">
            <strong>${r.name}</strong> — ${r.reason}
            <small class="text-muted d-block">${r.priceRange || ''}</small>
          </div>
        `).join('');
        insightsEl.style.display = 'block';
      }
    } catch {
      this.showFallback(containerId);
    }
  },

  async loadSimilar(productId, containerId = 'similar-products') {
    try {
      const response = await api.products.getBySlug(
        document.querySelector('[data-product-slug]')?.dataset.productSlug || ''
      );
      Utils.renderProductGrid(response.data.similar, containerId);
    } catch {
      document.getElementById(containerId).innerHTML = '';
    }
  },

  async showFallback(containerId) {
    try {
      const response = await api.products.getAll('limit=8&sort=popular');
      Utils.renderProductGrid(response.data, containerId);
    } catch {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '<p class="text-muted text-center">Products loading soon...</p>';
      }
    }
  },

  async loadCategories(containerId = 'categories-grid') {
    try {
      const response = await api.search.categories();
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = response.data.categories.map((cat) => `
        <div class="col-6 col-md-4 col-lg-3">
          <a href="/products.html?category=${cat.id}" class="text-decoration-none">
            <div class="category-card hover-lift reveal">
              <div class="category-icon"><i class="bi ${cat.icon}"></i></div>
              <div class="category-name">${cat.name}</div>
              <div class="category-desc">${cat.description}</div>
            </div>
          </a>
        </div>
      `).join('');
      Utils.initScrollReveal();
    } catch {}
  },
};

window.Recommendations = Recommendations;
