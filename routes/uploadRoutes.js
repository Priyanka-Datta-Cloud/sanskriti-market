const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');
const { uploadProductImages, deleteImage } = require('../controllers/uploadController');

router.post('/products',
  protect,
  authorize('seller', 'admin'),
  (req, res, next) => uploadProduct(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  }),
  uploadProductImages
);
router.delete('/image', protect, authorize('seller', 'admin'), deleteImage);

module.exports = router;
