const Product = require('../models/Product');
const Order = require('../models/Order');
const Store = require('../models/Store');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return errorResponse(res, 404, 'Store not found.');

    const [productCount, orderItems, revenue] = await Promise.all([
      Product.countDocuments({ seller: req.user._id, isActive: true }),
      Order.find({ 'items.product': { $in: await Product.find({ seller: req.user._id }).distinct('_id') } })
        .sort({ createdAt: -1 })
        .limit(10),
      Order.aggregate([
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: '$product' },
        { $match: { 'product.seller': req.user._id } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      ]),
    ]);

    const recentProducts = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    return successResponse(res, 200, 'Seller dashboard.', {
      store,
      stats: {
        products: productCount,
        orders: orderItems.length,
        revenue: revenue[0]?.total || 0,
      },
      recentProducts,
      recentOrders: orderItems,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Products retrieved.', { products });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const productIds = await Product.find({ seller: req.user._id }).distinct('_id');
    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return successResponse(res, 200, 'Orders retrieved.', { orders });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { getDashboard, getSellerProducts, getSellerOrders };
