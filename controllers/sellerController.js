const Product = require('../models/Product');
const Order = require('../models/Order');
const Store = require('../models/Store');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { calculatePagination } = require('../utils/helpers');

const getDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return errorResponse(res, 404, 'Store not found. Please set up your store.');

    const [totalProducts, activeProducts, pendingProducts] = await Promise.all([
      Product.countDocuments({ store: store._id }),
      Product.countDocuments({ store: store._id, isActive: true, isApproved: true }),
      Product.countDocuments({ store: store._id, isApproved: false }),
    ]);

    // Orders for seller's products
    const sellerProductIds = await Product.find({ store: store._id }).distinct('_id');
    const orders = await Order.find({ 'items.product': { $in: sellerProductIds } });
    const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => {
      const sellerItems = o.items.filter(i => sellerProductIds.some(id => id.equals(i.product)));
      return s + sellerItems.reduce((ss, i) => ss + i.price * i.quantity, 0);
    }, 0);

    const topProducts = await Product.find({ store: store._id, isActive: true })
      .sort({ soldCount: -1 }).limit(5).select('name price soldCount viewCount rating images');

    return successResponse(res, 200, 'Seller dashboard.', {
      store,
      stats: {
        totalProducts, activeProducts, pendingProducts,
        totalOrders: orders.length,
        totalRevenue: Math.round(totalRevenue),
        pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      },
      topProducts,
    });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const getMyProducts = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return errorResponse(res, 404, 'Store not found.');
    const filter = { store: store._id };
    if (req.query.status === 'active') { filter.isActive = true; filter.isApproved = true; }
    else if (req.query.status === 'pending') filter.isApproved = false;
    else if (req.query.status === 'inactive') filter.isActive = false;
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);
    return res.json({ success: true, data: products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const getMyOrders = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return errorResponse(res, 404, 'Store not found.');
    const sellerProductIds = await Product.find({ store: store._id }).distinct('_id');
    const orders = await Order.find({ 'items.product': { $in: sellerProductIds } })
      .sort({ createdAt: -1 }).limit(50).populate('user', 'name email');
    return successResponse(res, 200, 'Seller orders.', { orders });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

module.exports = { getDashboard, getMyProducts, getMyOrders };
