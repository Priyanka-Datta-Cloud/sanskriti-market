const Store = require('../models/Store');
const Product = require('../models/Product');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { calculatePagination } = require('../utils/helpers');

const getStores = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const filter = { isActive: true };

    const [stores, total] = await Promise.all([
      Store.find(filter).populate('owner', 'name avatar').sort({ rating: -1 }).skip(skip).limit(limit),
      Store.countDocuments(filter),
    ]);

    return paginatedResponse(res, stores, page, limit, total);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getStore = async (req, res) => {
  try {
    const query = req.params.slug ? { slug: req.params.slug } : { _id: req.params.id };
    const store = await Store.findOne(query).populate('owner', 'name avatar');
    if (!store || !store.isActive) return errorResponse(res, 404, 'Store not found.');

    const products = await Product.find({ store: store._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(12);

    return successResponse(res, 200, 'Store retrieved.', { store, products });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return errorResponse(res, 404, 'Store not found.');

    const allowed = ['name', 'description', 'tagline', 'logo', 'banner', 'location', 'craftSpecialty', 'socialLinks', 'story', 'policies', 'establishedYear'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) store[field] = req.body[field];
    });

    await store.save();
    return successResponse(res, 200, 'Store updated.', { store });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return errorResponse(res, 404, 'Store not found.');
    return successResponse(res, 200, 'Store retrieved.', { store });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { getStores, getStore, updateStore, getMyStore };
