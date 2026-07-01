const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { heritageGuide, giftFinder, generateProductDescription } = require('../controllers/aiController');

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests. Please wait.' }
});

router.post('/heritage', aiLimiter, heritageGuide);
router.post('/gift-finder', aiLimiter, giftFinder);
router.post('/generate-description', aiLimiter, generateProductDescription);

module.exports = router;