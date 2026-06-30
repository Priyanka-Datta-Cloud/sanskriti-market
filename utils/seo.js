const generateSitemap = (baseUrl, products = [], stores = []) => {
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/products.html', priority: '0.9', changefreq: 'daily' },
    { url: '/about.html', priority: '0.7', changefreq: 'monthly' },
    { url: '/search.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/login.html', priority: '0.5', changefreq: 'monthly' },
    { url: '/register.html', priority: '0.5', changefreq: 'monthly' },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  staticPages.forEach((page) => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  products.forEach((product) => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/product-detail.html?slug=${product.slug}</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  stores.forEach((store) => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/store.html?slug=${store.slug}</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
};

module.exports = { generateSitemap };
