const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', storeController.getStores);
router.get('/my', protect, authorize('seller'), storeController.getMyStore);
router.put('/my', protect, authorize('seller'), storeController.updateStore);
router.get('/slug/:slug', storeController.getStore);
router.get('/:id', storeController.getStore);

module.exports = router;
