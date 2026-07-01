const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests. Please wait.' }
});

const {
  heritageGuide,
  giftFinder,
  generateProductDescription
} = require('../controllers/aiController');

router.post('/heritage', aiLimiter, heritageGuide);
router.post('/chat', aiLimiter, heritageGuide);
router.post('/gift-finder', aiLimiter, giftFinder);
router.post('/generate-description', aiLimiter, generateProductDescription);
router.get('/recommendations', (req, res) => res.json({ success: true, data: [] }));
router.get('/trending', (req, res) => res.json({ success: true, data: [] }));
router.get('/featured', (req, res) => res.json({ success: true, data: [] }));
router.post('/generate-story', (req, res) => res.json({ success: true, data: {} }));

module.exports = router;