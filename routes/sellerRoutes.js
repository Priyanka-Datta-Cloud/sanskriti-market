const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboard, getMyProducts, getMyOrders } = require('../controllers/sellerController');

router.use(protect, authorize('seller', 'admin'));
router.get('/dashboard', getDashboard);
router.get('/products', getMyProducts);
router.get('/orders', getMyOrders);

module.exports = router;
