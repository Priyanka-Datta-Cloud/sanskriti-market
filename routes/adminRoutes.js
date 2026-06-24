const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard, getUsers, getPendingProducts, approveProduct,
  rejectProduct, verifyStore, getOrders, toggleUserStatus,
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.patch('/users/:id/toggle', toggleUserStatus);
router.get('/products/pending', getPendingProducts);
router.patch('/products/:id/approve', approveProduct);
router.patch('/products/:id/reject', rejectProduct);
router.patch('/stores/:id/verify', verifyStore);
router.get('/orders', getOrders);

module.exports = router;
