const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('seller'));
router.get('/dashboard', sellerController.getDashboard);
router.get('/products', sellerController.getSellerProducts);
router.get('/orders', sellerController.getSellerOrders);

module.exports = router;
