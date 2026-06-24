const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { heritageGuide, giftFinder, generateProductDescription } = require('../controllers/aiController');

const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { success: false, message: 'Too many AI requests. Please wait a moment.' } });

router.post('/heritage', aiLimiter, heritageGuide);
router.post('/gift-finder', aiLimiter, giftFinder);
router.post('/generate-description', aiLimiter, protect, generateProductDescription);

module.exports = router;
