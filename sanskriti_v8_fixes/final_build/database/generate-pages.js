const fs = require('fs');
const path = require('path');

const NAV = (active) => `
  <nav class="navbar navbar-expand-lg navbar-sanskriti fixed-top">
    <div class="container">
      <a class="navbar-brand" href="/">Sanskriti <span>Market</span></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item"><a class="nav-link ${active==='home'?'active':''}" href="/">Home</a></li>
          <li class="nav-item"><a class="nav-link ${active==='shop'?'active':''}" href="/products.html">Shop</a></li>
          <li class="nav-item"><a class="nav-link ${active==='discover'?'active':''}" href="/search.html">Discover</a></li>
          <li class="nav-item"><a class="nav-link ${active==='about'?'active':''}" href="/about.html">Our Story</a></li>
        </ul>
        <form class="d-none d-lg-block me-3" id="search-form"><div class="search-box"><i class="bi bi-search"></i><input type="search" id="search-input" placeholder="Search crafts..."></div></form>
        <div class="d-flex align-items-center gap-2">
          <a href="/wishlist.html" class="nav-icon-btn"><i class="bi bi-heart"></i><span class="badge-count" id="wishlist-count" style="display:none">0</span></a>
          <a href="/cart.html" class="nav-icon-btn"><i class="bi bi-bag"></i><span class="badge-count" id="cart-count" style="display:none">0</span></a>
          <a href="/login.html" class="btn btn-outline-sanskriti btn-sm" id="nav-login">Sign In</a>
          <div class="dropdown" id="nav-user-menu" style="display:none">
            <button class="btn btn-sanskriti btn-sm dropdown-toggle" data-bs-toggle="dropdown"><span id="nav-user-name">User</span></button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="/seller/dashboard.html" id="nav-seller" style="display:none">Seller Dashboard</a></li>
              <li><a class="dropdown-item" href="/admin/dashboard.html" id="nav-admin" style="display:none">Admin Panel</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" onclick="Auth.logout();return false">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>`;

const FOOTER = `
  <footer class="footer"><div class="container"><div class="row g-4">
    <div class="col-lg-4"><div class="footer-brand">Sanskriti Market</div><p class="footer-tagline">Handcrafted in India. Treasured Worldwide.</p></div>
    <div class="col-6 col-lg-2"><h5>Shop</h5><a href="/products.html">All Products</a><a href="/products.html?category=textiles">Textiles</a></div>
    <div class="col-6 col-lg-2"><h5>Company</h5><a href="/about.html">About Us</a><a href="/register.html?role=seller">Sell</a></div>
    <div class="col-6 col-lg-2"><h5>Support</h5><a href="#">Help</a><a href="#">Contact</a></div>
    <div class="col-6 col-lg-2"><h5>Legal</h5><a href="#">Privacy</a><a href="#">Terms</a></div>
  </div><div class="footer-bottom"><p>&copy; 2026 Sanskriti Market. All rights reserved.</p></div></div></footer>
  <div id="chatbot-widget" class="chatbot-widget"></div>`;

const HEAD = (title, desc) => `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="description" content="${desc}">
<title>${title} | Sanskriti Market</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
<link href="/css/main.css" rel="stylesheet"><link href="/css/components.css" rel="stylesheet"><link href="/css/animations.css" rel="stylesheet">
</head><body class="page-transition">`;

const SCRIPTS = (extra = '') => `
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="/js/api.js"></script><script src="/js/auth.js"></script><script src="/js/main.js"></script>
<script src="/js/cart.js"></script><script src="/js/wishlist.js"></script><script src="/js/search.js"></script>
<script src="/js/chatbot.js"></script><script src="/js/recommendations.js"></script>${extra}</body></html>`;

const base = path.join(__dirname, '..', 'frontend');

const pages = {
  'products.html': HEAD('Shop', 'Browse handcrafted Indian products') + NAV('shop') + `
<main class="container page-transition" style="padding-top:100px;padding-bottom:3rem">
  <nav aria-label="breadcrumb"><ol class="breadcrumb breadcrumb-sanskriti"><li class="breadcrumb-item"><a href="/">Home</a></li><li class="breadcrumb-item active">Shop</li></ol></nav>
  <div class="row">
    <aside class="col-lg-3 mb-4"><div class="filter-sidebar">
      <h5 class="mb-3">Filters</h5>
      <div class="filter-group"><h6>Category</h6>
        <label class="filter-option"><input type="radio" name="category" value="" checked> All</label>
        <label class="filter-option"><input type="radio" name="category" value="textiles"> Textiles</label>
        <label class="filter-option"><input type="radio" name="category" value="pottery"> Pottery</label>
        <label class="filter-option"><input type="radio" name="category" value="jewelry"> Jewelry</label>
        <label class="filter-option"><input type="radio" name="category" value="woodwork"> Woodwork</label>
        <label class="filter-option"><input type="radio" name="category" value="metalwork"> Metalwork</label>
        <label class="filter-option"><input type="radio" name="category" value="paintings"> Paintings</label>
        <label class="filter-option"><input type="radio" name="category" value="home-decor"> Home Decor</label>
      </div>
      <div class="filter-group"><h6>Sort By</h6>
        <select id="sort-select" class="form-select form-control-sanskriti">
          <option value="">Newest</option><option value="popular">Popular</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="rating">Top Rated</option>
        </select>
      </div>
      <div class="filter-group"><h6>Price Range</h6>
        <div class="d-flex gap-2"><input type="number" id="min-price" class="form-control form-control-sanskriti" placeholder="Min"><input type="number" id="max-price" class="form-control form-control-sanskriti" placeholder="Max"></div>
        <button class="btn-sanskriti btn-sm w-100 mt-2" onclick="applyFilters()">Apply</button>
      </div>
    </div></aside>
    <div class="col-lg-9">
      <div class="d-flex justify-content-between align-items-center mb-4"><h1 class="h3 mb-0">All Products</h1><span id="product-count" class="text-muted"></span></div>
      <div class="product-grid" id="products-grid"><div class="loading-spinner mx-auto"></div></div>
      <nav class="mt-4" id="pagination"></nav>
    </div>
  </div>
</main>` + FOOTER + SCRIPTS(`<script>
let currentPage=1;
async function loadProducts(page=1){
  currentPage=page;
  const params=new URLSearchParams();
  params.set('page',page);params.set('limit',12);
  const cat=document.querySelector('input[name=category]:checked')?.value;
  if(cat)params.set('category',cat);
  const sort=document.getElementById('sort-select')?.value;
  if(sort)params.set('sort',sort);
  const min=document.getElementById('min-price')?.value;
  const max=document.getElementById('max-price')?.value;
  if(min)params.set('minPrice',min);if(max)params.set('maxPrice',max);
  if(new URLSearchParams(location.search).get('featured')==='true')params.set('featured','true');
  try{const r=await api.products.getAll(params.toString());Utils.renderProductGrid(r.data,'products-grid');
  document.getElementById('product-count').textContent=r.pagination?r.pagination.total+' products':'';
  renderPagination(r.pagination);}catch(e){document.getElementById('products-grid').innerHTML='<div class="empty-state"><h4>Unable to load products</h4><p>Please ensure the server is running and MongoDB is connected.</p></div>';}}
function renderPagination(p){if(!p||p.pages<=1){document.getElementById('pagination').innerHTML='';return;}
let h='<ul class="pagination justify-content-center">';for(let i=1;i<=p.pages;i++)h+=\`<li class="page-item \${i===p.page?'active':''}"><a class="page-link" href="#" onclick="loadProducts(\${i});return false">\${i}</a></li>\`;h+='</ul>';document.getElementById('pagination').innerHTML=h;}
function applyFilters(){loadProducts(1);}
document.addEventListener('DOMContentLoaded',()=>{const c=new URLSearchParams(location.search).get('category');if(c){const r=document.querySelector(\`input[name=category][value="\${c}"]\`);if(r)r.checked=true;}loadProducts();document.getElementById('sort-select').addEventListener('change',()=>loadProducts(1));});
</script>`),

  'product-detail.html': HEAD('Product', 'Handcrafted product details') + NAV('shop') + `
<main class="container" style="padding-top:100px;padding-bottom:3rem" id="product-page">
  <div class="text-center py-5"><div class="loading-spinner"></div></div>
</main>` + FOOTER + SCRIPTS(`<script>
async function loadProduct(){
  const slug=Utils.getQueryParam('slug');if(!slug){location.href='/products.html';return;}
  try{const r=await api.products.getBySlug(slug);const p=r.data.product;const similar=r.data.similar||[];
  document.title=p.name+' | Sanskriti Market';
  document.getElementById('product-page').innerHTML=\`
  <nav aria-label="breadcrumb"><ol class="breadcrumb breadcrumb-sanskriti"><li class="breadcrumb-item"><a href="/">Home</a></li><li class="breadcrumb-item"><a href="/products.html">Shop</a></li><li class="breadcrumb-item active">\${p.name}</li></ol></nav>
  <div class="row g-5"><div class="col-lg-6"><div class="product-gallery"><img src="\${p.images?.[0]?.url||''}" alt="\${p.name}"></div></div>
  <div class="col-lg-6 product-info"><p class="text-muted mb-1"><a href="/store.html?slug=\${p.store?.slug||''}">\${p.store?.name||'Artisan Store'}</a></p>
  <h1>\${p.name}</h1><div class="product-rating mb-3">\${Utils.renderStars(p.rating)} <span class="text-muted">(\${p.reviewCount} reviews)</span></div>
  <div class="product-price-lg mb-3">\${Utils.formatPrice(p.price)}\${p.comparePrice?'<span class="text-muted text-decoration-line-through ms-2">'+Utils.formatPrice(p.comparePrice)+'</span>':''}</div>
  <p class="text-muted">\${p.shortDescription||p.description?.substring(0,200)}</p>
  <div class="product-meta">\${p.region?'<div class="meta-item"><i class="bi bi-geo-alt"></i> '+p.region+'</div>':''}\${p.craftTechnique?'<div class="meta-item"><i class="bi bi-tools"></i> '+p.craftTechnique+'</div>':''}\${p.isHandmade?'<div class="meta-item"><i class="bi bi-hand-index"></i> Handmade</div>':''}</div>
  <div class="d-flex align-items-center gap-3 mb-4"><div class="quantity-selector"><button onclick="changeQty(-1)">-</button><input type="number" id="qty" value="1" min="1" max="\${p.stock}" readonly><button onclick="changeQty(1)">+</button></div><span class="text-muted">\${p.stock} in stock</span></div>
  <div class="d-flex flex-wrap gap-3"><button class="btn-sanskriti" onclick="Cart.add('\${p._id}',parseInt(document.getElementById('qty').value))"><i class="bi bi-bag-plus"></i> Add to Cart</button>
  <button class="btn-outline-sanskriti" onclick="Wishlist.toggle('\${p._id}')"><i class="bi bi-heart"></i> Wishlist</button></div>
  <div class="mt-4"><h5>Description</h5><p>\${p.description}</p>\${p.materials?.length?'<p><strong>Materials:</strong> '+p.materials.join(', ')+'</p>':''}</div></div></div>
  <div id="story-section" class="story-section mt-5" style="display:none"></div>
  <section class="mt-5"><h3 class="mb-4">You May Also Like</h3><div class="product-grid" id="similar-products"></div></section>\`;
  Utils.renderProductGrid(similar,'similar-products');
  try{const s=await api.products.getStory(p._id);if(s.data?.story){const st=s.data.story;document.getElementById('story-section').style.display='block';
  document.getElementById('story-section').innerHTML=\`<h3>\${st.title}</h3><div class="artisan-card"><div class="artisan-avatar">\${st.artisan?.name?.[0]||'A'}</div><div><h5>\${st.artisan?.name}</h5><p class="text-muted mb-0">\${st.artisan?.location||''} · \${st.artisan?.yearsOfExperience||''} years experience</p></div></div><p>\${st.narrative}</p>\${st.culturalSignificance?'<p><em>'+st.culturalSignificance+'</em></p>':''}\`;}}catch{}}catch(e){document.getElementById('product-page').innerHTML='<div class="empty-state"><h4>Product not found</h4><a href="/products.html" class="btn-sanskriti">Browse Products</a></div>';}}
let qty=1;function changeQty(d){const inp=document.getElementById('qty');if(!inp)return;qty=Math.max(1,Math.min(parseInt(inp.max),qty+d));inp.value=qty;}
document.addEventListener('DOMContentLoaded',loadProduct);
</script>`),

  'cart.html': HEAD('Cart', 'Your shopping cart') + NAV('shop') + `
<main class="container" style="padding-top:100px;padding-bottom:3rem"><h1 class="h3 mb-4">Shopping Cart</h1>
<div class="row"><div class="col-lg-8" id="cart-items"><div class="loading-spinner"></div></div>
<div class="col-lg-4"><div class="cart-summary" id="cart-summary"></div></div></div></main>` + FOOTER + SCRIPTS(`<script>
async function renderCart(){if(!Auth.requireAuth())return;
try{const r=await api.cart.get();const cart=r.data.cart;const subtotal=r.data.subtotal||0;
if(!cart.items.length){document.getElementById('cart-items').innerHTML='<div class="empty-state"><i class="bi bi-bag"></i><h4>Your cart is empty</h4><a href="/products.html" class="btn-sanskriti">Continue Shopping</a></div>';document.getElementById('cart-summary').innerHTML='';return;}
document.getElementById('cart-items').innerHTML=cart.items.map(i=>\`<div class="cart-item"><div class="cart-item-image"><img src="\${i.product?.images?.[0]?.url||''}" alt=""></div><div class="flex-grow-1"><h6>\${i.product?.name}</h6><p class="text-muted mb-2">\${Utils.formatPrice(i.product?.price)}</p><div class="quantity-selector d-inline-flex"><button onclick="Cart.update('\${i._id}',\${i.quantity-1})">-</button><input value="\${i.quantity}" readonly><button onclick="Cart.update('\${i._id}',\${i.quantity+1})">+</button></div></div><div class="text-end"><strong>\${Utils.formatPrice(i.product?.price*i.quantity)}</strong><br><button class="btn btn-sm text-danger mt-2" onclick="Cart.remove('\${i._id}')"><i class="bi bi-trash"></i></button></div></div>\`).join('');
const shipping=subtotal>=2000?0:99;const tax=Math.round(subtotal*0.05);const total=subtotal+shipping+tax;
document.getElementById('cart-summary').innerHTML=\`<h5>Order Summary</h5><div class="cart-summary-row"><span>Subtotal</span><span>\${Utils.formatPrice(subtotal)}</span></div><div class="cart-summary-row"><span>Shipping</span><span>\${shipping===0?'Free':Utils.formatPrice(shipping)}</span></div><div class="cart-summary-row"><span>Tax (5%)</span><span>\${Utils.formatPrice(tax)}</span></div><div class="cart-summary-row cart-summary-total"><span>Total</span><span>\${Utils.formatPrice(total)}</span></div><button class="btn-sanskriti w-100 mt-3" onclick="checkout()">Proceed to Checkout</button>\`;
}catch(e){document.getElementById('cart-items').innerHTML='<div class="alert alert-warning">Unable to load cart</div>';}}
async function checkout(){const addr={name:Auth.getUser()?.name||'',street:prompt('Street address:')||'',city:prompt('City:')||'',state:prompt('State:')||'',pincode:prompt('Pincode:')||'',phone:prompt('Phone:')||''};
try{await api.orders.create({shippingAddress:addr,paymentMethod:'cod'});Utils.showToast('Order placed!','success');setTimeout(()=>location.href='/',2000);}catch(e){Utils.showToast(e.message,'error');}}
document.addEventListener('DOMContentLoaded',renderCart);window.renderCart=renderCart;
</script>`),

  'wishlist.html': HEAD('Wishlist', 'Your saved items') + NAV('shop') + `
<main class="container" style="padding-top:100px;padding-bottom:3rem"><h1 class="h3 mb-4">My Wishlist</h1>
<div class="product-grid" id="wishlist-grid"><div class="loading-spinner mx-auto"></div></div></main>` + FOOTER + SCRIPTS(`<script>
async function renderWishlist(){if(!Auth.requireAuth())return;
try{const r=await api.wishlist.get();const products=r.data.wishlist?.products||[];
if(!products.length){document.getElementById('wishlist-grid').innerHTML='<div class="empty-state col-12"><i class="bi bi-heart"></i><h4>Your wishlist is empty</h4><a href="/products.html" class="btn-sanskriti">Discover Products</a></div>';return;}
Utils.renderProductGrid(products,'wishlist-grid');}catch(e){document.getElementById('wishlist-grid').innerHTML='<div class="alert alert-warning">Unable to load wishlist</div>';}}
document.addEventListener('DOMContentLoaded',renderWishlist);window.renderWishlist=renderWishlist;
</script>`),

  'login.html': HEAD('Sign In', 'Login to Sanskriti Market') + `
<main class="auth-container"><div class="auth-card"><h2>Welcome Back</h2><p class="subtitle">Sign in to continue your journey</p>
<form id="login-form"><div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control form-control-sanskriti" id="email" required></div>
<div class="mb-3"><label class="form-label">Password</label><input type="password" class="form-control form-control-sanskriti" id="password" required></div>
<button type="submit" class="btn-sanskriti w-100">Sign In</button></form>
<p class="text-center mt-3">Don't have an account? <a href="/register.html">Register</a></p></div></main>` + SCRIPTS(`<script>
document.getElementById('login-form').addEventListener('submit',async(e)=>{e.preventDefault();
try{await Auth.login(document.getElementById('email').value,document.getElementById('password').value);
Utils.showToast('Welcome back!','success');setTimeout(()=>location.href=Auth.getRedirectUrl(),500);}catch(err){Utils.showToast(err.message,'error');}});
</script>`),

  'register.html': HEAD('Register', 'Create your account') + `
<main class="auth-container"><div class="auth-card"><h2>Join Sanskriti</h2><p class="subtitle">Create your account</p>
<form id="register-form"><div class="mb-3"><label class="form-label">Full Name</label><input type="text" class="form-control form-control-sanskriti" id="name" required></div>
<div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control form-control-sanskriti" id="email" required></div>
<div class="mb-3"><label class="form-label">Password</label><input type="password" class="form-control form-control-sanskriti" id="password" minlength="6" required></div>
<div class="mb-3"><label class="form-label">I want to</label><select class="form-select form-control-sanskriti" id="role"><option value="customer">Shop as Customer</option><option value="seller">Sell as Artisan</option></select></div>
<button type="submit" class="btn-sanskriti w-100">Create Account</button></form>
<p class="text-center mt-3">Already have an account? <a href="/login.html">Sign In</a></p></div></main>` + SCRIPTS(`<script>
document.addEventListener('DOMContentLoaded',()=>{if(new URLSearchParams(location.search).get('role')==='seller')document.getElementById('role').value='seller';});
document.getElementById('register-form').addEventListener('submit',async(e)=>{e.preventDefault();
try{await Auth.register(document.getElementById('name').value,document.getElementById('email').value,document.getElementById('password').value,document.getElementById('role').value);
Utils.showToast('Account created!','success');setTimeout(()=>location.href='/',500);}catch(err){Utils.showToast(err.message,'error');}});
</script>`),

  'search.html': HEAD('Discover', 'Search handcrafted products') + NAV('discover') + `
<main class="container" style="padding-top:100px;padding-bottom:3rem">
<h1 class="h3 mb-4">Discover Crafts</h1>
<form id="search-page-form" class="mb-4"><div class="search-box mx-auto" style="max-width:600px"><i class="bi bi-search"></i><input type="search" id="search-page-input" placeholder="Search products, stores, crafts..." autofocus></div></form>
<ul class="nav nav-tabs mb-4" id="search-tabs"><li class="nav-item"><a class="nav-link active" data-type="all" href="#">All</a></li><li class="nav-item"><a class="nav-link" data-type="products" href="#">Products</a></li><li class="nav-item"><a class="nav-link" data-type="stores" href="#">Stores</a></li></ul>
<div id="search-results"></div></main>` + FOOTER + SCRIPTS(`<script>
let searchType='all';
async function doSearch(q){if(!q)return;document.getElementById('search-results').innerHTML='<div class="loading-spinner mx-auto"></div>';
try{const r=await Search.perform(q,searchType);if(!r)return;
let html='';if(r.products?.length){html+='<h4 class="mb-3">Products</h4><div class="product-grid mb-4">'+r.products.map(p=>Utils.renderProductCard(p)).join('')+'</div>';}
if(r.stores?.length){html+='<h4 class="mb-3">Stores</h4><div class="row g-3">'+r.stores.map(s=>\`<div class="col-md-4"><a href="/store.html?slug=\${s.slug}" class="text-decoration-none"><div class="category-card"><div class="category-name">\${s.name}</div><div class="category-desc">\${s.tagline||s.description?.substring(0,80)}</div></div></a></div>\`).join('')+'</div>';}
if(!html)html='<div class="empty-state"><h4>No results found</h4></div>';document.getElementById('search-results').innerHTML=html;}catch{}}
document.getElementById('search-page-form').addEventListener('submit',e=>{e.preventDefault();doSearch(document.getElementById('search-page-input').value);});
document.querySelectorAll('#search-tabs .nav-link').forEach(t=>t.addEventListener('click',e=>{e.preventDefault();document.querySelectorAll('#search-tabs .nav-link').forEach(x=>x.classList.remove('active'));t.classList.add('active');searchType=t.dataset.type;doSearch(document.getElementById('search-page-input').value);}));
document.addEventListener('DOMContentLoaded',()=>{const q=Utils.getQueryParam('q');if(q){document.getElementById('search-page-input').value=q;doSearch(q);}});
</script>`),

  'store.html': HEAD('Creator Store', 'Artisan storefront') + NAV('discover') + `
<main id="store-page" style="padding-top:80px"><div class="text-center py-5"><div class="loading-spinner"></div></div></main>` + FOOTER + SCRIPTS(`<script>
async function loadStore(){const slug=Utils.getQueryParam('slug');if(!slug){location.href='/search.html';return;}
try{const r=await api.stores.getBySlug(slug);const s=r.data.store;const products=r.data.products||[];
document.title=s.name+' | Sanskriti Market';
document.getElementById('store-page').innerHTML=\`<div class="store-banner"></div><div class="container" style="margin-top:-60px;position:relative;z-index:2;padding-bottom:3rem">
<div class="store-profile mb-4"><div class="store-logo">\${s.name[0]}</div><div class="pb-3"><h1>\${s.name}</h1><p class="text-muted mb-1">\${s.tagline||''}</p><div class="product-rating">\${Utils.renderStars(s.rating)} (\${s.reviewCount} reviews) · \${s.productCount} products</div></div></div>
<p class="mb-4">\${s.description||''}</p>\${s.location?.city?'<p><i class="bi bi-geo-alt"></i> '+s.location.city+', '+s.location.state+'</p>':''}
<h3 class="mb-4">Products</h3><div class="product-grid" id="store-products"></div></div>\`;
Utils.renderProductGrid(products,'store-products');}catch{document.getElementById('store-page').innerHTML='<div class="empty-state py-5"><h4>Store not found</h4></div>';}}
document.addEventListener('DOMContentLoaded',loadStore);
</script>`),

  'about.html': HEAD('Our Story', 'About Sanskriti Market') + NAV('about') + `
<main class="container" style="padding-top:100px;padding-bottom:3rem">
<div class="row align-items-center g-5 mb-5"><div class="col-lg-6"><h1 class="display-5 mb-4">Preserving Heritage, <span style="color:var(--primary)">Empowering Artisans</span></h1>
<p class="lead text-muted">Sanskriti Market was born from a simple belief: every handcrafted piece carries the soul of its maker and the wisdom of generations.</p>
<p>We connect master craftspeople from the villages of India with discerning collectors worldwide. From the handlooms of Varanasi to the pottery wheels of Jaipur, from the silver workshops of Odisha to the wood carvers of Saharanpur — every product on our platform is a testament to living heritage.</p></div>
<div class="col-lg-6"><div class="story-section"><h3>Our Mission</h3><p>To create the world's most trusted marketplace for authentic Indian handicrafts, ensuring fair compensation for artisans while bringing their extraordinary work to global audiences.</p></div></div></div>
<div class="row g-4 text-center"><div class="col-md-4"><div class="stat-card"><div class="stat-icon" style="background:#F5E6EA;color:var(--primary)"><i class="bi bi-people"></i></div><div class="stat-value">500+</div><div class="stat-label">Artisan Partners</div></div></div>
<div class="col-md-4"><div class="stat-card"><div class="stat-icon" style="background:#FDF6E3;color:var(--secondary)"><i class="bi bi-gem"></i></div><div class="stat-value">10,000+</div><div class="stat-label">Handcrafted Products</div></div></div>
<div class="col-md-4"><div class="stat-card"><div class="stat-icon" style="background:#E8F5E9;color:var(--accent)"><i class="bi bi-globe"></i></div><div class="stat-value">50+</div><div class="stat-label">Countries Served</div></div></div></div>
</main>` + FOOTER + SCRIPTS(),
};

// Seller pages
const sellerPages = {
  'dashboard.html': `<div class="dashboard-sidebar"><div class="brand">Sanskriti Seller</div><ul class="sidebar-nav">
<li><a href="/seller/dashboard.html" class="active"><i class="bi bi-grid"></i> Dashboard</a></li>
<li><a href="/seller/products.html"><i class="bi bi-box"></i> Products</a></li>
<li><a href="/seller/orders.html"><i class="bi bi-receipt"></i> Orders</a></li>
<li><a href="/seller/settings.html"><i class="bi bi-gear"></i> Settings</a></li>
<li><a href="/" ><i class="bi bi-shop"></i> View Store</a></li></ul></div>
<div class="dashboard-main"><h2 class="mb-4">Seller Dashboard</h2>
<div class="row g-4 mb-4" id="seller-stats"></div>
<h4 class="mb-3">Recent Products</h4><div id="seller-products" class="product-grid"></div></div>`,
  'products.html': `<div class="dashboard-sidebar"><div class="brand">Sanskriti Seller</div><ul class="sidebar-nav">
<li><a href="/seller/dashboard.html"><i class="bi bi-grid"></i> Dashboard</a></li>
<li><a href="/seller/products.html" class="active"><i class="bi bi-box"></i> Products</a></li>
<li><a href="/seller/orders.html"><i class="bi bi-receipt"></i> Orders</a></li>
<li><a href="/seller/settings.html"><i class="bi bi-gear"></i> Settings</a></li></ul></div>
<div class="dashboard-main"><div class="d-flex justify-content-between mb-4"><h2>My Products</h2><button class="btn-sanskriti" data-bs-toggle="modal" data-bs-target="#addProductModal">Add Product</button></div>
<div class="table-sanskriti"><table class="table table-sanskriti mb-0"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody id="products-table"></tbody></table></div></div>
<div class="modal fade" id="addProductModal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5>Add Product</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
<div class="modal-body"><form id="add-product-form"><div class="mb-3"><label class="form-label">Name</label><input class="form-control form-control-sanskriti" id="p-name" required></div>
<div class="mb-3"><label class="form-label">Description</label><textarea class="form-control form-control-sanskriti" id="p-desc" rows="3" required></textarea></div>
<div class="row"><div class="col-6 mb-3"><label class="form-label">Price (INR)</label><input type="number" class="form-control form-control-sanskriti" id="p-price" required></div>
<div class="col-6 mb-3"><label class="form-label">Stock</label><input type="number" class="form-control form-control-sanskriti" id="p-stock" value="10"></div></div>
<div class="mb-3"><label class="form-label">Category</label><select class="form-select form-control-sanskriti" id="p-category"><option value="textiles">Textiles</option><option value="pottery">Pottery</option><option value="jewelry">Jewelry</option><option value="woodwork">Woodwork</option><option value="metalwork">Metalwork</option><option value="paintings">Paintings</option><option value="home-decor">Home Decor</option><option value="accessories">Accessories</option></select></div>
<button type="submit" class="btn-sanskriti w-100">Create Product</button></form></div></div></div></div>`,
  'orders.html': `<div class="dashboard-sidebar"><div class="brand">Sanskriti Seller</div><ul class="sidebar-nav">
<li><a href="/seller/dashboard.html"><i class="bi bi-grid"></i> Dashboard</a></li>
<li><a href="/seller/products.html"><i class="bi bi-box"></i> Products</a></li>
<li><a href="/seller/orders.html" class="active"><i class="bi bi-receipt"></i> Orders</a></li>
<li><a href="/seller/settings.html"><i class="bi bi-gear"></i> Settings</a></li></ul></div>
<div class="dashboard-main"><h2 class="mb-4">Orders</h2><div class="table-sanskriti"><table class="table mb-0"><thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody id="orders-table"></tbody></table></div></div>`,
  'settings.html': `<div class="dashboard-sidebar"><div class="brand">Sanskriti Seller</div><ul class="sidebar-nav">
<li><a href="/seller/dashboard.html"><i class="bi bi-grid"></i> Dashboard</a></li>
<li><a href="/seller/products.html"><i class="bi bi-box"></i> Products</a></li>
<li><a href="/seller/orders.html"><i class="bi bi-receipt"></i> Orders</a></li>
<li><a href="/seller/settings.html" class="active"><i class="bi bi-gear"></i> Settings</a></li></ul></div>
<div class="dashboard-main"><h2 class="mb-4">Store Settings</h2><form id="store-form" class="col-lg-8"><div class="mb-3"><label class="form-label">Store Name</label><input class="form-control form-control-sanskriti" id="s-name"></div>
<div class="mb-3"><label class="form-label">Tagline</label><input class="form-control form-control-sanskriti" id="s-tagline"></div>
<div class="mb-3"><label class="form-label">Description</label><textarea class="form-control form-control-sanskriti" id="s-desc" rows="4"></textarea></div>
<div class="row"><div class="col-6 mb-3"><label class="form-label">City</label><input class="form-control form-control-sanskriti" id="s-city"></div>
<div class="col-6 mb-3"><label class="form-label">State</label><input class="form-control form-control-sanskriti" id="s-state"></div></div>
<button type="submit" class="btn-sanskriti">Save Changes</button></form></div>`,
};

const sellerScripts = {
  'dashboard.html': `document.addEventListener('DOMContentLoaded',async()=>{if(!Auth.requireRole('seller'))return;
try{const r=await api.seller.dashboard();const s=r.data.stats;
document.getElementById('seller-stats').innerHTML=\`<div class="col-md-4"><div class="stat-card"><div class="stat-value">\${s.products}</div><div class="stat-label">Products</div></div></div><div class="col-md-4"><div class="stat-card"><div class="stat-value">\${s.orders}</div><div class="stat-label">Orders</div></div></div><div class="col-md-4"><div class="stat-card"><div class="stat-value">\${Utils.formatPrice(s.revenue)}</div><div class="stat-label">Revenue</div></div></div>\`;
Utils.renderProductGrid(r.data.recentProducts||[],'seller-products');}catch(e){Utils.showToast(e.message,'error');}});`,
  'products.html': `async function loadProducts(){const r=await api.seller.products();document.getElementById('products-table').innerHTML=(r.data.products||[]).map(p=>\`<tr><td>\${p.name}</td><td>\${Utils.formatPrice(p.price)}</td><td>\${p.stock}</td><td><span class="status-badge \${p.isActive?'confirmed':'cancelled'}">\${p.isActive?'Active':'Inactive'}</span></td><td><button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('\${p._id}')">Delete</button></td></tr>\`).join('');}
async function deleteProduct(id){if(!confirm('Deactivate this product?'))return;await api.products.delete(id);loadProducts();}
document.getElementById('add-product-form')?.addEventListener('submit',async e=>{e.preventDefault();await api.products.create({name:document.getElementById('p-name').value,description:document.getElementById('p-desc').value,price:parseFloat(document.getElementById('p-price').value),stock:parseInt(document.getElementById('p-stock').value),category:document.getElementById('p-category').value,shortDescription:document.getElementById('p-desc').value.substring(0,200)});bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();loadProducts();Utils.showToast('Product created','success');});
document.addEventListener('DOMContentLoaded',()=>{if(Auth.requireRole('seller'))loadProducts();});`,
  'orders.html': `document.addEventListener('DOMContentLoaded',async()=>{if(!Auth.requireRole('seller'))return;
const r=await api.seller.orders();document.getElementById('orders-table').innerHTML=(r.data.orders||[]).map(o=>\`<tr><td>\${o.orderNumber}</td><td>\${o.user?.name||'-'}</td><td>\${Utils.formatPrice(o.total)}</td><td><span class="status-badge \${o.status}">\${o.status}</span></td><td>\${new Date(o.createdAt).toLocaleDateString()}</td></tr>\`).join('');});`,
  'settings.html': `document.addEventListener('DOMContentLoaded',async()=>{if(!Auth.requireRole('seller'))return;
const r=await api.stores.getMy();const s=r.data.store;document.getElementById('s-name').value=s.name||'';document.getElementById('s-tagline').value=s.tagline||'';document.getElementById('s-desc').value=s.description||'';document.getElementById('s-city').value=s.location?.city||'';document.getElementById('s-state').value=s.location?.state||'';});
document.getElementById('store-form')?.addEventListener('submit',async e=>{e.preventDefault();await api.stores.update({name:document.getElementById('s-name').value,tagline:document.getElementById('s-tagline').value,description:document.getElementById('s-desc').value,location:{city:document.getElementById('s-city').value,state:document.getElementById('s-state').value}});Utils.showToast('Store updated','success');});`,
};

// Admin pages
const adminPages = {
  'dashboard.html': `<div class="dashboard-sidebar" style="background:#1A1A2E"><div class="brand">Sanskriti Admin</div><ul class="sidebar-nav">
<li><a href="/admin/dashboard.html" class="active"><i class="bi bi-grid"></i> Dashboard</a></li>
<li><a href="/admin/users.html"><i class="bi bi-people"></i> Users</a></li>
<li><a href="/admin/products.html"><i class="bi bi-box"></i> Products</a></li>
<li><a href="/admin/orders.html"><i class="bi bi-receipt"></i> Orders</a></li></ul></div>
<div class="dashboard-main"><h2 class="mb-4">Admin Dashboard</h2><div class="row g-4 mb-4" id="admin-stats"></div>
<h4>Recent Orders</h4><div class="table-sanskriti"><table class="table mb-0"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody id="recent-orders"></tbody></table></div></div>`,
  'users.html': `<div class="dashboard-sidebar" style="background:#1A1A2E"><div class="brand">Sanskriti Admin</div><ul class="sidebar-nav">
<li><a href="/admin/dashboard.html"><i class="bi bi-grid"></i> Dashboard</a></li>
<li><a href="/admin/users.html" class="active"><i class="bi bi-people"></i> Users</a></li>
<li><a href="/admin/products.html"><i class="bi bi-box"></i> Products</a></li>
<li><a href="/admin/orders.html"><i class="bi bi-receipt"></i> Orders</a></li></ul></div>
<div class="dashboard-main"><h2 class="mb-4">Users</h2><div class="table-sanskriti"><table class="table mb-0"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody id="users-table"></tbody></table></div></div>`,
  'products.html': `<div class="dashboard-sidebar" style="background:#1A1A2E"><div class="brand">Sanskriti Admin</div><ul class="sidebar-nav">
<li><a href="/admin/dashboard.html"><i class="bi bi-grid"></i> Dashboard</a></li>
<li><a href="/admin/users.html"><i class="bi bi-people"></i> Users</a></li>
<li><a href="/admin/products.html" class="active"><i class="bi bi-box"></i> Products</a></li>
<li><a href="/admin/orders.html"><i class="bi bi-receipt"></i> Orders</a></li></ul></div>
<div class="dashboard-main"><h2 class="mb-4">All Products</h2><div class="table-sanskriti"><table class="table mb-0"><thead><tr><th>Product</th><th>Seller</th><th>Price</th><th>Featured</th><th>Actions</th></tr></thead><tbody id="admin-products-table"></tbody></table></div></div>`,
  'orders.html': `<div class="dashboard-sidebar" style="background:#1A1A2E"><div class="brand">Sanskriti Admin</div><ul class="sidebar-nav">
<li><a href="/admin/dashboard.html"><i class="bi bi-grid"></i> Dashboard</a></li>
<li><a href="/admin/users.html"><i class="bi bi-people"></i> Users</a></li>
<li><a href="/admin/products.html"><i class="bi bi-box"></i> Products</a></li>
<li><a href="/admin/orders.html" class="active"><i class="bi bi-receipt"></i> Orders</a></li></ul></div>
<div class="dashboard-main"><h2 class="mb-4">All Orders</h2><div class="table-sanskriti"><table class="table mb-0"><thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody id="admin-orders-table"></tbody></table></div></div>`,
};

const adminScripts = {
  'dashboard.html': `document.addEventListener('DOMContentLoaded',async()=>{if(!Auth.requireRole('admin'))return;
const r=await api.admin.dashboard();const s=r.data.stats;
document.getElementById('admin-stats').innerHTML=\`<div class="col-md-3"><div class="stat-card"><div class="stat-value">\${s.users}</div><div class="stat-label">Users</div></div></div><div class="col-md-3"><div class="stat-card"><div class="stat-value">\${s.products}</div><div class="stat-label">Products</div></div></div><div class="col-md-3"><div class="stat-card"><div class="stat-value">\${s.orders}</div><div class="stat-label">Orders</div></div></div><div class="col-md-3"><div class="stat-card"><div class="stat-value">\${Utils.formatPrice(s.revenue)}</div><div class="stat-label">Revenue</div></div></div>\`;
document.getElementById('recent-orders').innerHTML=(r.data.recentOrders||[]).map(o=>\`<tr><td>\${o.orderNumber}</td><td>\${o.user?.name||'-'}</td><td>\${Utils.formatPrice(o.total)}</td><td><span class="status-badge \${o.status}">\${o.status}</span></td></tr>\`).join('');});`,
  'users.html': `document.addEventListener('DOMContentLoaded',async()=>{if(!Auth.requireRole('admin'))return;
const r=await api.admin.users();document.getElementById('users-table').innerHTML=(r.data||[]).map(u=>\`<tr><td>\${u.name}</td><td>\${u.email}</td><td>\${u.role}</td><td><span class="status-badge \${u.isActive?'confirmed':'cancelled'}">\${u.isActive?'Active':'Inactive'}</span></td><td><select onchange="updateUser('\${u._id}',this.value)" class="form-select form-select-sm"><option value="customer" \${u.role==='customer'?'selected':''}>Customer</option><option value="seller" \${u.role==='seller'?'selected':''}>Seller</option><option value="admin" \${u.role==='admin'?'selected':''}>Admin</option></select></td></tr>\`).join('');});
async function updateUser(id,role){await api.admin.updateUser(id,{role});Utils.showToast('User updated','success');}`,
  'products.html': `document.addEventListener('DOMContentLoaded',async()=>{if(!Auth.requireRole('admin'))return;
const r=await api.admin.products();document.getElementById('admin-products-table').innerHTML=(r.data||[]).map(p=>\`<tr><td>\${p.name}</td><td>\${p.seller?.name||'-'}</td><td>\${Utils.formatPrice(p.price)}</td><td>\${p.isFeatured?'Yes':'No'}</td><td><button class="btn btn-sm btn-outline-sanskriti" onclick="toggleFeatured('\${p._id}')">Toggle Featured</button></td></tr>\`).join('');});
async function toggleFeatured(id){await api.admin.toggleFeatured(id);location.reload();}`,
  'orders.html': `document.addEventListener('DOMContentLoaded',async()=>{if(!Auth.requireRole('admin'))return;
const r=await api.admin.orders();document.getElementById('admin-orders-table').innerHTML=(r.data||[]).map(o=>\`<tr><td>\${o.orderNumber}</td><td>\${o.user?.name||'-'}</td><td>\${Utils.formatPrice(o.total)}</td><td><select class="form-select form-select-sm" onchange="updateStatus('\${o._id}',this.value)"><option value="pending" \${o.status==='pending'?'selected':''}>Pending</option><option value="confirmed" \${o.status==='confirmed'?'selected':''}>Confirmed</option><option value="shipped" \${o.status==='shipped'?'selected':''}>Shipped</option><option value="delivered" \${o.status==='delivered'?'selected':''}>Delivered</option></select></td><td>\${new Date(o.createdAt).toLocaleDateString()}</td></tr>\`).join('');});
async function updateStatus(id,status){await api.orders.updateStatus(id,{status});Utils.showToast('Order updated','success');}`,
};

// Write main pages
Object.entries(pages).forEach(([file, content]) => {
  fs.writeFileSync(path.join(base, file), content);
  console.log('Created:', file);
});

// Write seller pages
Object.entries(sellerPages).forEach(([file, body]) => {
  const html = HEAD('Seller ' + file.replace('.html',''), 'Seller dashboard') + body + SCRIPTS(`<script>${sellerScripts[file]}</script>`);
  fs.writeFileSync(path.join(base, 'seller', file), html);
  console.log('Created: seller/' + file);
});

// Write admin pages
Object.entries(adminPages).forEach(([file, body]) => {
  const html = HEAD('Admin ' + file.replace('.html',''), 'Admin dashboard') + body + SCRIPTS(`<script>${adminScripts[file]}</script>`);
  fs.writeFileSync(path.join(base, 'admin', file), html);
  console.log('Created: admin/' + file);
});

console.log('All pages generated.');
