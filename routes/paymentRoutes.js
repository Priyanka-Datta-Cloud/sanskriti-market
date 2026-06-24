const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createRazorpayOrder, verifyPayment, razorpayWebhook, getPaymentConfig } = require('../controllers/paymentController');

router.get('/config', getPaymentConfig);
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), razorpayWebhook);

module.exports = router;
