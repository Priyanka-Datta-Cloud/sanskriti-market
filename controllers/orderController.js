const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { calculatePagination } = require('../utils/helpers');
const { sendOrderConfirmation } = require('../services/emailService');

const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return errorResponse(res, 400, 'Cart is empty.');

    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) continue;
      if (item.product.stock < item.quantity) {
        return errorResponse(res, 400, `Insufficient stock for ${item.product.name}.`);
      }
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0]?.url || '',
        price: item.product.price,
        quantity: item.quantity,
      });
      subtotal += item.product.price * item.quantity;
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    const shippingCost = subtotal >= 2000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shippingCost + tax;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || 'cod',
      subtotal,
      shippingCost,
      tax,
      total,
      notes: req.body.notes,
    });

    cart.items = [];
    await cart.save();
    await sendOrderConfirmation(order, req.user);

    return successResponse(res, 201, 'Order placed successfully.', { order });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getOrders = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    return paginatedResponse(res, orders, page, limit, total);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getOrder = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.user = req.user._id;

    const order = await Order.findOne(filter).populate('items.product', 'name slug images');
    if (!order) return errorResponse(res, 404, 'Order not found.');
    return successResponse(res, 200, 'Order retrieved.', { order });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return errorResponse(res, 404, 'Order not found.');

    const { status, trackingNumber } = req.body;
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.deliveredAt = new Date();
    if (status === 'cancelled') {
      order.cancelledAt = new Date();
      order.cancelReason = req.body.cancelReason || '';
    }

    await order.save();
    return successResponse(res, 200, 'Order updated.', { order });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus };
