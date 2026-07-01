const Search = {
  async perform(query, type = 'all') {
    if (!query || query.trim().length < 2) {
      Utils.showToast('Please enter at least 2 characters', 'error');
      return null;
    }
    try {
      const response = await api.search.query(query.trim(), type);
      return response.data;
    } catch (error) {
      Utils.showToast(error.message, 'error');
      return null;
    }
  },

  initSearchBar() {
    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput?.value?.trim();
        if (query) {
          window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
        }
      });
    }

    if (searchInput) {
      let debounce;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => this.showSuggestions(searchInput.value), 300);
      });
    }
  },

  async showSuggestions(query) {
    const container = document.getElementById('search-suggestions');
    if (!container || !query || query.length < 2) {
      if (container) container.innerHTML = '';
      return;
    }

    try {
      const results = await api.search.query(query, 'products');
      const products = results.data?.products || [];
      if (products.length === 0) {
        container.innerHTML = '';
        return;
      }
      container.innerHTML = products.slice(0, 5).map((p) => `
        <a href="/product-detail.html?slug=${p.slug}" class="suggestion-item d-block p-2 text-decoration-none text-dark">
          <small>${p.name}</small>
          <small class="text-muted d-block">${Utils.formatPrice(p.price)}</small>
        </a>
      `).join('');
    } catch {
      container.innerHTML = '';
    }
  },
};

window.Search = Search;
