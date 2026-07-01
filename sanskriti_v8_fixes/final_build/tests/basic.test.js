const assert = require('assert');
const { formatPrice, sanitizeSearch, calculatePagination } = require('../utils/helpers');
const { generateSitemap } = require('../utils/seo');

assert.strictEqual(formatPrice(1000).includes('1,000') || formatPrice(1000).includes('1000'), true);
assert.strictEqual(sanitizeSearch('test.query'), 'test\\.query');
const pag = calculatePagination(2, 10);
assert.strictEqual(pag.page, 2);
assert.strictEqual(pag.skip, 10);
const sitemap = generateSitemap('https://example.com', [{ slug: 'test-product' }], [{ slug: 'test-store' }]);
assert.ok(sitemap.includes('test-product'));
assert.ok(sitemap.includes('test-store'));
console.log('All basic tests passed.');
