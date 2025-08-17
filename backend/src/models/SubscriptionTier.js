const mongoose = require('mongoose');

const subscriptionTierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String,
    trim: true
  }],
  artistRevenueShare: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 20
  },
  platformRevenueShare: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 80
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure revenue shares always total 100%
subscriptionTierSchema.pre('save', function(next) {
  this.platformRevenueShare = 100 - this.artistRevenueShare;
  next();
});

// Static method to create default tiers
subscriptionTierSchema.statics.createDefaultTiers = async function() {
  const SubscriptionTier = this;
  
  try {
    // Check if tiers already exist
    const existingTiers = await SubscriptionTier.find();
    if (existingTiers.length > 0) {
      return existingTiers;
    }
    
    // Create default tiers
    const defaultTiers = [
      {
        name: 'Free',
        price: 0,
        features: [
          'Basic streaming',
          'Create playlists',
          'Follow artists',
          'Limited ad-supported listening'
        ],
        artistRevenueShare: 20,
        description: 'Free tier with basic features and ads',
        icon: 'tier_free_icon'
      },
      {
        name: 'Pro',
        price: 9.99,
        features: [
          'Ad-free listening',
          'Unlimited skips',
          'Enhanced audio quality',
          'Offline listening',
          'Basic analytics'
        ],
        artistRevenueShare: 30,
        description: 'Premium experience with enhanced features',
        icon: 'tier_pro_icon'
      },
      {
        name: 'Pro+',
        price: 14.99,
        features: [
          'All Pro features',
          'Advanced analytics',
          'AI A&R for track analysis',
          'Marketing tools',
          'Collaborative features'
        ],
        artistRevenueShare: 40,
        description: 'Advanced features for serious artists',
        icon: 'tier_proplus_icon'
      },
      {
        name: 'Elite',
        price: 24.99,
        features: [
          'All Pro+ features',
          'AI Manager for career guidance',
          'Industry connections',
          'Priority placement',
          'Exclusive promotional opportunities',
          'Full marketing suite'
        ],
        artistRevenueShare: 50,
        description: 'Complete professional suite for career artists',
        icon: 'tier_elite_icon'
      }
    ];
    
    return await SubscriptionTier.insertMany(defaultTiers);
  } catch (error) {
    console.error('Error creating default tiers:', error);
    throw error;
  }
};

const SubscriptionTier = mongoose.model('SubscriptionTier', subscriptionTierSchema);

module.exports = SubscriptionTier;