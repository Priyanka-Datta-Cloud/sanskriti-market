const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', productController.getProducts);
router.get('/story/:productId', productController.getProductStory);
router.get('/slug/:slug', optionalAuth, productController.getProduct);
router.get('/:id', optionalAuth, productController.getProduct);
router.post('/', protect, authorize('seller', 'admin'), productController.createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), productController.updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), productController.deleteProduct);
router.post('/story', protect, authorize('seller', 'admin'), productController.createProductStory);

module.exports = router;
