const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createOrder, getMyOrders, getOrder, cancelOrder, updateOrderStatus } = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, authorize('admin', 'seller'), updateOrderStatus);

module.exports = router;
