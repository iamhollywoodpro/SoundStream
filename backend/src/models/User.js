const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'artist', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  subscription: {
    tierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionTier'
    },
    name: String,
    startDate: Date,
    nextBillingDate: Date,
    active: {
      type: Boolean,
      default: false
    },
    cancelDate: Date
  },
  paymentMethods: [{
    type: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_account'],
    },
    details: {
      type: Object
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has specific subscription tier
userSchema.methods.hasSubscriptionTier = function(tierName) {
  return this.subscription && 
         this.subscription.active && 
         this.subscription.name === tierName;
};

// Method to check if user has at least a specific subscription tier level
userSchema.methods.hasMinimumSubscriptionTier = async function(minTierName) {
  // If no subscription or inactive, return false
  if (!this.subscription || !this.subscription.active) {
    return false;
  }
  
  try {
    // Get all tiers for comparison
    const SubscriptionTier = mongoose.model('SubscriptionTier');
    const tiers = await SubscriptionTier.find().sort({ price: 1 });
    
    // Find indices of current tier and minimum tier
    const currentTierIndex = tiers.findIndex(tier => tier.name === this.subscription.name);
    const minTierIndex = tiers.findIndex(tier => tier.name === minTierName);
    
    // If either tier not found, return false
    if (currentTierIndex === -1 || minTierIndex === -1) {
      return false;
    }
    
    // Return true if current tier index is >= minimum tier index
    return currentTierIndex >= minTierIndex;
  } catch (error) {
    console.error('Error checking subscription tier level:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;