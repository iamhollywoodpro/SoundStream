const subscriptionService = require('../services/subscriptionService');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all subscription tiers
 * @route   GET /api/subscription/tiers
 * @access  Public
 */
const getSubscriptionTiers = async (req, res) => {
  try {
    const tiers = await subscriptionService.getAvailableTiers();
    res.json(tiers);
  } catch (error) {
    console.error('Error fetching subscription tiers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get current user subscription
 * @route   GET /api/subscription/current
 * @access  Private
 */
const getCurrentSubscription = async (req, res) => {
  try {
    // User should be attached by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    if (req.user.subscription && req.user.subscription.active) {
      return res.json(req.user.subscription);
    } else {
      return res.json({ active: false });
    }
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Subscribe to tier
 * @route   POST /api/subscription/subscribe
 * @access  Private
 */
const subscribeTier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // User should be attached by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    const { tierId, paymentDetails } = req.body;
    
    if (!tierId) {
      return res.status(400).json({ message: 'Tier ID is required' });
    }
    
    const result = await subscriptionService.subscribeTier(req.user._id, tierId, paymentDetails);
    
    res.json(result);
  } catch (error) {
    console.error('Error subscribing to tier:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Cancel subscription
 * @route   POST /api/subscription/cancel
 * @access  Private
 */
const cancelSubscription = async (req, res) => {
  try {
    // User should be attached by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    const user = await subscriptionService.cancelSubscription(req.user._id);
    
    res.json({ message: 'Subscription cancelled successfully', user });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Calculate ad revenue split
 * @route   POST /api/subscription/revenue-split
 * @access  Private
 */
const calculateRevenueSplit = async (req, res) => {
  try {
    // User should be attached by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    const { totalRevenue } = req.body;
    
    if (!totalRevenue || isNaN(totalRevenue)) {
      return res.status(400).json({ message: 'Valid total revenue amount is required' });
    }
    
    const result = await subscriptionService.calculateAdRevenueSplit(
      req.user._id,
      parseFloat(totalRevenue)
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error calculating revenue split:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSubscriptionTiers,
  getCurrentSubscription,
  subscribeTier,
  cancelSubscription,
  calculateRevenueSplit
};