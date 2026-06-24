const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Store = require('../models/Store');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true }).populate('owner','name avatar').limit(20);
    return successResponse(res, 200, 'Stores retrieved.', { stores });
  } catch (e) { return errorResponse(res, 500, e.message); }
});

// Get store by slug
router.get('/:slug', async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug, isActive: true }).populate('owner','name avatar');
    if (!store) return errorResponse(res, 404, 'Store not found.');
    const products = await Product.find({ store: store._id, isActive: true, isApproved: true })
      .sort({ isFeatured: -1, createdAt: -1 }).limit(20);
    return successResponse(res, 200, 'Store retrieved.', { store, products });
  } catch (e) { return errorResponse(res, 500, e.message); }
});

// Update own store
router.put('/me', protect, authorize('seller'), async (req, res) => {
  try {
    const allowed = ['name','description','tagline','bio','story','socialLinks','craftTypes','returnPolicy','shippingPolicy'];
    const update = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
    const store = await Store.findOneAndUpdate({ owner: req.user._id }, update, { new: true });
    if (!store) return errorResponse(res, 404, 'Store not found.');
    return successResponse(res, 200, 'Store updated.', { store });
  } catch (e) { return errorResponse(res, 500, e.message); }
});

module.exports = router;
