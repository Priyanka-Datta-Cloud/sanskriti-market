// Reviews module — include this on product-detail.html
const Reviews = {
  productId: null,
  page: 1,
  stats: {},

  async init(productId) {
    this.productId = productId;
    await this.load();
    this.renderForm();
  },

  async load(page = 1) {
    this.page = page;
    const container = document.getElementById('reviews-container');
    if (!container) return;
    container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-danger spinner-border-sm"></div> Loading reviews...</div>';
    try {
      const res = await API.get(`/api/products/${this.productId}/reviews?page=${page}&limit=5`);
      this.stats = res.data.avgRating !== undefined ? res.data : {};
      this.renderStats(res.data);
      this.renderList(res.data.data || [], res.data);
    } catch {
      container.innerHTML = '<p class="text-muted">Could not load reviews.</p>';
    }
  },

  renderStats(data) {
    const el = document.getElementById('review-stats');
    if (!el) return;
    const avg = data.avgRating || 0;
    const total = data.total || 0;
    const breakdown = data.breakdown || [];
    const stars = (n, size = 18) => [5,4,3,2,1].map(i =>
      `<i class="bi bi-star${i <= Math.round(n) ? '-fill' : (i - n < 1 ? '-half' : '')}" style="color:#C9A962;font-size:${size}px"></i>`
    ).join('');

    el.innerHTML = `
      <div class="d-flex align-items-center gap-4 flex-wrap mb-4">
        <div class="text-center">
          <div style="font-size:3.5rem;font-weight:700;color:#8B2942;line-height:1">${avg.toFixed(1)}</div>
          <div>${stars(avg)}</div>
          <div style="color:#8B7355;font-size:0.85rem;margin-top:4px">${total} review${total !== 1 ? 's' : ''}</div>
        </div>
        <div style="flex:1;min-width:200px">
          ${breakdown.map(b => `
            <div class="d-flex align-items-center gap-2 mb-1">
              <span style="font-size:12px;color:#555;min-width:40px">${b.star} ★</span>
              <div style="flex:1;height:6px;background:#F5F0E8;border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${total ? (b.count/total*100).toFixed(0) : 0}%;background:#C9A962;border-radius:3px"></div>
              </div>
              <span style="font-size:12px;color:#8B7355;min-width:24px">${b.count}</span>
            </div>`).join('')}
        </div>
      </div>`;
  },

  renderList(reviews, meta) {
    const container = document.getElementById('reviews-container');
    if (!reviews.length) {
      container.innerHTML = `<div class="text-center py-5" style="color:#aaa"><i class="bi bi-chat-dots" style="font-size:2.5rem"></i><p class="mt-3">No reviews yet. Be the first to review this product!</p></div>`;
      return;
    }
    const starHtml = (n) => [1,2,3,4,5].map(i => `<i class="bi bi-star${i <= n ? '-fill' : ''}" style="color:#C9A962;font-size:14px"></i>`).join('');
    container.innerHTML = reviews.map(r => `
      <div class="review-card mb-3 p-3" style="background:#F5F0E8;border-radius:14px">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div class="d-flex align-items-center gap-3">
            <div style="width:40px;height:40px;border-radius:50%;background:#8B2942;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">
              ${(r.user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style="font-weight:600">${r.user?.name || 'Anonymous'}</div>
              <div style="font-size:12px;color:#8B7355">${new Date(r.createdAt).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</div>
            </div>
          </div>
          <div>
            ${starHtml(r.rating)}
            ${r.isVerifiedPurchase ? '<span class="ms-2" style="font-size:11px;color:#27ae60;background:#eafaf1;padding:2px 8px;border-radius:20px"><i class="bi bi-patch-check-fill me-1"></i>Verified Purchase</span>' : ''}
          </div>
        </div>
        ${r.title ? `<div class="mt-2" style="font-weight:600">${r.title}</div>` : ''}
        <p style="color:#555;margin:8px 0 12px;line-height:1.6;font-size:0.95rem">${r.comment || ''}</p>
        <button onclick="Reviews.markHelpful('${r._id}', this)" class="btn btn-sm btn-outline-secondary" style="font-size:12px;border-radius:20px">
          <i class="bi bi-hand-thumbs-up me-1"></i>Helpful (${r.helpful || 0})
        </button>
      </div>`).join('');

    // Pagination
    const totalPages = Math.ceil((meta.total || 0) / 5);
    if (totalPages > 1) {
      const pag = document.createElement('div');
      pag.className = 'd-flex justify-content-center gap-2 mt-4';
      for (let p = 1; p <= totalPages; p++) {
        const btn = document.createElement('button');
        btn.className = `btn btn-sm ${p === this.page ? 'btn-sanskriti' : 'btn-outline-secondary'}`;
        btn.textContent = p;
        btn.onclick = () => Reviews.load(p);
        pag.appendChild(btn);
      }
      container.appendChild(pag);
    }
  },

  renderForm() {
    const form = document.getElementById('review-form');
    if (!form) return;
    form.innerHTML = `
      <h5 style="color:#8B2942;font-weight:600;margin-bottom:16px">Write a Review</h5>
      <div id="review-form-alert" class="alert" style="display:none"></div>
      <div class="mb-3">
        <label style="font-size:0.9rem;color:#555;margin-bottom:6px">Your Rating *</label>
        <div id="star-input" style="display:flex;gap:6px">
          ${[1,2,3,4,5].map(i => `<i class="bi bi-star" data-val="${i}" onclick="Reviews.setRating(${i})" onmouseover="Reviews.hoverRating(${i})" onmouseout="Reviews.resetHover()" style="font-size:1.8rem;cursor:pointer;color:#ddd;transition:color .1s"></i>`).join('')}
        </div>
        <input type="hidden" id="review-rating" value="0">
      </div>
      <div class="mb-3">
        <label class="form-label" style="font-size:0.9rem">Review Title</label>
        <input class="form-control" id="review-title" placeholder="Summarise your experience" maxlength="100">
      </div>
      <div class="mb-3">
        <label class="form-label" style="font-size:0.9rem">Your Review *</label>
        <textarea class="form-control" id="review-comment" rows="4" placeholder="Share your thoughts about the product, craftsmanship, and seller..." maxlength="1000"></textarea>
      </div>
      <button class="btn btn-sanskriti" onclick="Reviews.submit()"><i class="bi bi-send me-2"></i>Submit Review</button>`;
  },

  setRating(val) {
    document.getElementById('review-rating').value = val;
    document.querySelectorAll('#star-input i').forEach((el, i) => {
      el.className = `bi bi-star${i < val ? '-fill' : ''}`;
      el.style.color = i < val ? '#C9A962' : '#ddd';
    });
  },
  hoverRating(val) {
    document.querySelectorAll('#star-input i').forEach((el, i) => {
      el.style.color = i < val ? '#C9A962' : '#ddd';
    });
  },
  resetHover() {
    const current = parseInt(document.getElementById('review-rating').value);
    document.querySelectorAll('#star-input i').forEach((el, i) => {
      el.style.color = i < current ? '#C9A962' : '#ddd';
    });
  },

  async submit() {
    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value.trim();
    const title = document.getElementById('review-title').value.trim();
    const alertEl = document.getElementById('review-form-alert');

    if (!rating) { alertEl.className='alert alert-warning'; alertEl.textContent='Please select a star rating.'; alertEl.style.display='block'; return; }
    if (!comment) { alertEl.className='alert alert-warning'; alertEl.textContent='Please write a review comment.'; alertEl.style.display='block'; return; }

    try {
      await API.post(`/api/products/${this.productId}/reviews`, { rating, title, comment });
      alertEl.className='alert alert-success'; alertEl.textContent='Review submitted! Thank you.'; alertEl.style.display='block';
      document.getElementById('review-comment').value = '';
      document.getElementById('review-title').value = '';
      this.setRating(0);
      setTimeout(() => this.load(), 1500);
    } catch (e) {
      alertEl.className='alert alert-danger'; alertEl.textContent=e.message || 'Could not submit review.'; alertEl.style.display='block';
    }
  },

  async markHelpful(id, btn) {
    try {
      const res = await API.post(`/api/products/${this.productId}/reviews/${id}/helpful`);
      btn.innerHTML = `<i class="bi bi-hand-thumbs-up-fill me-1"></i>Helpful (${res.data.helpful})`;
      btn.disabled = true;
    } catch {}
  },
};
