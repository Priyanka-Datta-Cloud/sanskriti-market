const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');
const {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, getFeaturedProducts, getNewArrivals,
} = require('../controllers/productController');

const handleUpload = (req, res, next) => {
  uploadProduct(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id', optionalAuth, getProduct);
router.post('/', protect, authorize('seller', 'admin'), handleUpload, createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), handleUpload, updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

module.exports = router;
