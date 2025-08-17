const SubscriptionTier = require('../models/SubscriptionTier');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

class SubscriptionService {
  /**
   * Get all available subscription tiers
   * @returns {Promise<Array>} List of subscription tiers
   */
  async getAvailableTiers() {
    try {
      return await SubscriptionTier.find({ isActive: true }).sort({ price: 1 });
    } catch (error) {
      console.error('Error fetching subscription tiers:', error);
      throw error;
    }
  }

  /**
   * Subscribe user to a specific tier
   * @param {String} userId - The user's ID
   * @param {String} tierId - The subscription tier ID
   * @param {Object} paymentDetails - Payment information
   * @returns {Promise<Object>} Updated user object with subscription
   */
  async subscribeTier(userId, tierId, paymentDetails) {
    try {
      // Validate inputs
      if (!userId || !tierId) {
        throw new Error('User ID and Tier ID are required');
      }

      // Find the tier
      const tier = await SubscriptionTier.findById(tierId);
      if (!tier || !tier.isActive) {
        throw new Error('Invalid or inactive subscription tier');
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Process payment (mock implementation - would integrate with payment processor)
      const paymentSuccessful = await this._processPayment(tier.price, paymentDetails);
      if (!paymentSuccessful) {
        throw new Error('Payment processing failed');
      }

      // Calculate next billing date (1 month from now)
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      // Create transaction record
      await Transaction.create({
        userId,
        amount: tier.price,
        type: 'subscription',
        status: 'completed',
        details: {
          tierId: tier._id,
          tierName: tier.name
        }
      });

      // Update user subscription
      user.subscription = {
        tierId: tier._id,
        name: tier.name,
        startDate: new Date(),
        nextBillingDate,
        active: true
      };

      // Save user changes
      await user.save();

      return {
        user,
        subscription: user.subscription
      };
    } catch (error) {
      console.error('Error subscribing to tier:', error);
      throw error;
    }
  }

  /**
   * Calculate ad revenue split based on user's subscription tier
   * @param {String} userId - The user's ID
   * @param {Number} totalRevenue - Total ad revenue to split
   * @returns {Promise<Object>} Revenue split calculation
   */
  async calculateAdRevenueSplit(userId, totalRevenue) {
    try {
      // Find user with their subscription tier
      const user = await User.findById(userId).populate({
        path: 'subscription.tierId',
        model: 'SubscriptionTier'
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get the subscription tier
      let tier;
      if (user.subscription && user.subscription.tierId) {
        tier = user.subscription.tierId;
      } else {
        // Default to Free tier if user has no subscription
        tier = await SubscriptionTier.findOne({ name: 'Free' });
      }

      if (!tier) {
        throw new Error('Could not determine user tier');
      }

      // Calculate revenue split
      const artistRevenue = (totalRevenue * tier.artistRevenueShare) / 100;
      const platformRevenue = totalRevenue - artistRevenue;

      return {
        tierName: tier.name,
        totalRevenue,
        artistRevenue: parseFloat(artistRevenue.toFixed(2)),
        platformRevenue: parseFloat(platformRevenue.toFixed(2)),
        artistShare: tier.artistRevenueShare,
        platformShare: tier.platformRevenueShare
      };
    } catch (error) {
      console.error('Error calculating ad revenue split:', error);
      throw error;
    }
  }

  /**
   * Process payment (mock implementation)
   * @private
   * @param {Number} amount - Amount to charge
   * @param {Object} paymentDetails - Payment details
   * @returns {Promise<Boolean>} Payment success status
   */
  async _processPayment(amount, paymentDetails) {
    // This would be replaced with actual payment processor integration
    // such as Stripe, PayPal, etc.
    
    return new Promise((resolve) => {
      // Simulate payment processing delay
      setTimeout(() => {
        // Mock successful payment (would include actual validation in production)
        const success = true;
        resolve(success);
      }, 1000);
    });
  }

  /**
   * Cancel user subscription
   * @param {String} userId - The user's ID
   * @returns {Promise<Object>} Updated user object
   */
  async cancelSubscription(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (!user.subscription || !user.subscription.active) {
        throw new Error('No active subscription found');
      }
      
      // Update subscription status
      user.subscription.active = false;
      user.subscription.cancelDate = new Date();
      
      // Save user changes
      await user.save();
      
      return user;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }
}

module.exports = new SubscriptionService();