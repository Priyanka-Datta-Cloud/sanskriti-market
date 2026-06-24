const generateSitemap = (baseUrl, products = [], stores = []) => {
  const today = new Date().toISOString().split('T')[0];
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/products.html', priority: '0.9', changefreq: 'daily' },
    { url: '/india-craft-map.html', priority: '0.9', changefreq: 'weekly' },
    { url: '/heritage.html', priority: '0.9', changefreq: 'monthly' },
    { url: '/about.html', priority: '0.7', changefreq: 'monthly' },
  ];
  const urls = [
    ...staticPages.map(p => `<url><loc>${baseUrl}${p.url}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`),
    ...products.map(p => `<url><loc>${baseUrl}/product/${p.slug}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`),
    ...stores.map(s => `<url><loc>${baseUrl}/store/${s.slug}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
};
module.exports = { generateSitemap };
