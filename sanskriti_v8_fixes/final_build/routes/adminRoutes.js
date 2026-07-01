const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.get('/products', adminController.getAllProducts);
router.put('/products/:id/featured', adminController.toggleProductFeatured);
router.get('/orders', adminController.getAllOrders);

module.exports = router;
