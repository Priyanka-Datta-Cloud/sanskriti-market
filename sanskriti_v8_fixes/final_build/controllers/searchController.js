const Product = require('../models/Product');
const Store = require('../models/Store');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizeSearch, calculatePagination } = require('../utils/helpers');

const search = async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    if (!q || q.trim().length < 2) {
      return errorResponse(res, 400, 'Search query must be at least 2 characters.');
    }

    const regex = new RegExp(sanitizeSearch(q), 'i');
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const results = { products: [], stores: [], total: 0 };

    if (type === 'all' || type === 'products') {
      const [products, productCount] = await Promise.all([
        Product.find({
          isActive: true,
          $or: [
            { name: regex },
            { description: regex },
            { tags: regex },
            { category: regex },
            { region: regex },
          ],
        })
          .populate('store', 'name slug')
          .sort({ rating: -1 })
          .skip(skip)
          .limit(limit),
        Product.countDocuments({
          isActive: true,
          $or: [{ name: regex }, { description: regex }, { tags: regex }],
        }),
      ]);
      results.products = products;
      results.productCount = productCount;
    }

    if (type === 'all' || type === 'stores') {
      const [stores, storeCount] = await Promise.all([
        Store.find({
          isActive: true,
          $or: [{ name: regex }, { description: regex }, { craftSpecialty: regex }],
        })
          .populate('owner', 'name')
          .skip(skip)
          .limit(limit),
        Store.countDocuments({
          isActive: true,
          $or: [{ name: regex }, { description: regex }],
        }),
      ]);
      results.stores = stores;
      results.storeCount = storeCount;
    }

    results.total = (results.productCount || 0) + (results.storeCount || 0);
    results.query = q;

    return successResponse(res, 200, 'Search results.', results);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getCategories = async (req, res) => {
  const categories = [
    { id: 'textiles', name: 'Textiles', icon: 'bi-scissors', description: 'Handwoven sarees, block prints, and fabrics' },
    { id: 'pottery', name: 'Pottery', icon: 'bi-circle', description: 'Terracotta, blue pottery, and ceramic art' },
    { id: 'jewelry', name: 'Jewelry', icon: 'bi-gem', description: 'Silver, temple, and tribal jewelry' },
    { id: 'woodwork', name: 'Woodwork', icon: 'bi-tree', description: 'Carved furniture and decorative pieces' },
    { id: 'metalwork', name: 'Metalwork', icon: 'bi-hammer', description: 'Brass, copper, and bronze crafts' },
    { id: 'paintings', name: 'Paintings', icon: 'bi-palette', description: 'Madhubani, Warli, and folk art' },
    { id: 'home-decor', name: 'Home Decor', icon: 'bi-house-heart', description: 'Lamps, wall art, and accents' },
    { id: 'accessories', name: 'Accessories', icon: 'bi-bag-heart', description: 'Bags, scarves, and artisan accessories' },
  ];
  return successResponse(res, 200, 'Categories retrieved.', { categories });
};

module.exports = { search, getCategories };
