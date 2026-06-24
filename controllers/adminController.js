const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Store = require('../models/Store');
const Review = require('../models/Review');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { calculatePagination } = require('../utils/helpers');

const getDashboard = async (req, res) => {
  try {
    const [users, products, orders, stores] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Store.countDocuments({ isActive: true }),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');
    const pendingProducts = await Product.countDocuments({ isApproved: false, isActive: true });

    return successResponse(res, 200, 'Dashboard data.', {
      stats: { users, products, orders, stores, revenue: revenueAgg[0]?.total || 0, pendingApprovals: pendingProducts },
      recentOrders,
    });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const getUsers = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) filter.$or = [{ name: new RegExp(req.query.search, 'i') }, { email: new RegExp(req.query.search, 'i') }];
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);
    return res.json({ success: true, data: users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false, isActive: true })
      .populate('seller', 'name email').populate('store', 'name').sort({ createdAt: -1 });
    return successResponse(res, 200, 'Pending products.', { products });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, approvedAt: new Date(), approvedBy: req.user._id },
      { new: true }
    );
    if (!product) return errorResponse(res, 404, 'Product not found.');
    return successResponse(res, 200, 'Product approved.', { product });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return errorResponse(res, 404, 'Product not found.');
    return successResponse(res, 200, 'Product rejected.');
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const verifyStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id, { isVerified: true, verifiedAt: new Date() }, { new: true }
    );
    if (!store) return errorResponse(res, 404, 'Store not found.');
    return successResponse(res, 200, 'Store verified.', { store });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const getOrders = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
      Order.countDocuments(filter),
    ]);
    return res.json({ success: true, data: orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found.');
    if (user.role === 'admin') return errorResponse(res, 403, 'Cannot deactivate admin.');
    user.isActive = !user.isActive;
    await user.save();
    return successResponse(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}.`, { isActive: user.isActive });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

module.exports = { getDashboard, getUsers, getPendingProducts, approveProduct, rejectProduct, verifyStore, getOrders, toggleUserStatus };
