const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { calculatePagination } = require('../utils/helpers');
const { sendOrderConfirmation } = require('../services/emailService');

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'cod', notes } = req.body;

    // Validate required address fields
    const required = ['name', 'street', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!shippingAddress?.[field]?.trim()) {
        return errorResponse(res, 400, `Shipping address missing: ${field}`);
      }
    }

    // Load cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return errorResponse(res, 400, 'Your cart is empty.');
    }

    // Build order items & validate stock
    const items = [];
    let subtotal = 0;
    for (const item of cart.items) {
      const product = item.product;
      if (!product || !product.isActive) {
        return errorResponse(res, 400, `Product "${product?.name || 'unknown'}" is no longer available.`);
      }
      if (product.stock < item.quantity) {
        return errorResponse(res, 400, `Only ${product.stock} unit(s) of "${product.name}" available.`);
      }
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.price,
        quantity: item.quantity,
      });
    }

    const shippingCost = subtotal >= 2000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      notes,
      subtotal,
      shippingCost,
      tax,
      total,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
    });

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Send confirmation for COD
    if (paymentMethod === 'cod') {
      await sendOrderConfirmation(order, req.user);
    }

    return successResponse(res, 201, 'Order created successfully.', { order });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit || 10);
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;

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
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };
    const order = await Order.findOne(filter).populate('user', 'name email');
    if (!order) return errorResponse(res, 404, 'Order not found.');
    return successResponse(res, 200, 'Order retrieved.', { order });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };
    const order = await Order.findOne(filter);
    if (!order) return errorResponse(res, 404, 'Order not found.');
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return errorResponse(res, 400, `Cannot cancel an order that is already ${order.status}.`);
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by user';
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      });
    }

    return successResponse(res, 200, 'Order cancelled.', { order });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    const update = { status };
    if (trackingNumber) update.trackingNumber = trackingNumber;
    if (status === 'delivered') update.deliveredAt = new Date();
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return errorResponse(res, 404, 'Order not found.');
    return successResponse(res, 200, 'Order status updated.', { order });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, cancelOrder, updateOrderStatus };
