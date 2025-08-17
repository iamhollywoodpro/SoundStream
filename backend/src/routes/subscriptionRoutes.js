const express = require('express');
const { body } = require('express-validator');
const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all subscription tiers
router.get('/tiers', subscriptionController.getSubscriptionTiers);

// Get current user subscription
router.get('/current', protect, subscriptionController.getCurrentSubscription);

// Subscribe to tier
router.post(
  '/subscribe',
  protect,
  [
    body('tierId').notEmpty().withMessage('Tier ID is required'),
  ],
  subscriptionController.subscribeTier
);

// Cancel subscription
router.post('/cancel', protect, subscriptionController.cancelSubscription);

// Calculate revenue split
router.post(
  '/revenue-split',
  protect,
  [
    body('totalRevenue').isNumeric().withMessage('Valid total revenue amount is required'),
  ],
  subscriptionController.calculateRevenueSplit
);

module.exports = router;