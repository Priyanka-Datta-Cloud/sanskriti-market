const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/auth');

router.post('/chat', aiController.aiChat);
router.get('/recommendations', optionalAuth, aiController.getRecommendations);
router.get('/trending', aiController.getTrending);
router.get('/featured', aiController.getFeatured);
router.post('/generate-story', aiController.generateStory);

module.exports = router;
