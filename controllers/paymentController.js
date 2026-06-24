const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sendOrderConfirmation } = require('../services/emailService');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Step 1: Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) return errorResponse(res, 404, 'Order not found.');
    if (order.paymentStatus === 'paid') return errorResponse(res, 400, 'Order already paid.');

    const razorpay = getRazorpay();
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order._id.toString(), userId: req.user._id.toString() },
    });

    order.razorpayOrderId = rpOrder.id;
    await order.save();

    return successResponse(res, 200, 'Razorpay order created.', {
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderNumber: order.orderNumber,
      userName: req.user.name,
      userEmail: req.user.email,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// Step 2: Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return errorResponse(res, 400, 'Payment verification failed. Invalid signature.');
    }

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) return errorResponse(res, 404, 'Order not found.');

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.paidAt = new Date();
    await order.save();

    await sendOrderConfirmation(order, req.user);

    return successResponse(res, 200, 'Payment verified. Order confirmed!', { order });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// Razorpay webhook (for server-to-server confirmation)
const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers['x-razorpay-signature'];
      const body = JSON.stringify(req.body);
      const expectedSig = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
      if (signature !== expectedSig) return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    if (event === 'payment.captured') {
      const payment = req.body.payload.payment.entity;
      const order = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        order.razorpayPaymentId = payment.id;
        await order.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment key (for frontend)
const getPaymentConfig = async (req, res) => {
  return successResponse(res, 200, 'Payment config.', {
    keyId: process.env.RAZORPAY_KEY_ID || null,
    currency: 'INR',
  });
};

module.exports = { createRazorpayOrder, verifyPayment, razorpayWebhook, getPaymentConfig };
