const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Store = require('../models/Store');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { calculatePagination } = require('../utils/helpers');

const getDashboard = async (req, res) => {
  try {
    const [userCount, productCount, orderCount, storeCount, revenue, recentOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Store.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
    ]);

    return successResponse(res, 200, 'Admin dashboard.', {
      stats: {
        users: userCount,
        products: productCount,
        orders: orderCount,
        stores: storeCount,
        revenue: revenue[0]?.total || 0,
      },
      recentOrders,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    return paginatedResponse(res, users, page, limit, total);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found.');

    if (req.body.role) user.role = req.body.role;
    if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
    await user.save();

    return successResponse(res, 200, 'User updated.', { user: user.toPublicJSON() });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const [products, total] = await Promise.all([
      Product.find().populate('store', 'name').populate('seller', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);
    return paginatedResponse(res, products, page, limit, total);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const toggleProductFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return errorResponse(res, 404, 'Product not found.');
    product.isFeatured = !product.isFeatured;
    await product.save();
    return successResponse(res, 200, 'Product updated.', { product });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const [orders, total] = await Promise.all([
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(),
    ]);
    return paginatedResponse(res, orders, page, limit, total);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  updateUser,
  getAllProducts,
  toggleProductFeatured,
  getAllOrders,
};
