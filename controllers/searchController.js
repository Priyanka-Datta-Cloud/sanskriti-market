const Product = require('../models/Product');
const Store = require('../models/Store');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const search = async (req, res) => {
  try {
    const { q, category, region, minPrice, maxPrice, sort = 'newest', page = 1, limit = 12 } = req.query;
    if (!q && !category && !region) return errorResponse(res, 400, 'Provide a search query, category, or region.');

    const filter = { isActive: true, isApproved: true };
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (region) filter.region = region;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'bestseller') sortObj = { soldCount: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(parseInt(limit))
        .populate('store', 'name slug'),
      Product.countDocuments(filter),
    ]);

    // Also search stores if q present
    let stores = [];
    if (q) {
      stores = await Store.find({
        isActive: true,
        $or: [{ name: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }, { craftTypes: new RegExp(q, 'i') }],
      }).limit(3).select('name slug logo tagline location');
    }

    return successResponse(res, 200, 'Search results.', {
      products, stores, total, page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      query: q || '',
    });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const autocomplete = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return successResponse(res, 200, 'Suggestions.', { suggestions: [] });

    const [products, stores] = await Promise.all([
      Product.find({ isActive: true, isApproved: true, name: new RegExp(q, 'i') })
        .select('name category region').limit(5),
      Store.find({ isActive: true, name: new RegExp(q, 'i') }).select('name').limit(3),
    ]);

    const suggestions = [
      ...products.map(p => ({ type: 'product', label: p.name, category: p.category, region: p.region })),
      ...stores.map(s => ({ type: 'store', label: s.name + ' (Store)' })),
    ];
    return successResponse(res, 200, 'Suggestions.', { suggestions });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

module.exports = { search, autocomplete };
