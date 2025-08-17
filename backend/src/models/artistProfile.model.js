const mongoose = require('mongoose');

const ArtistProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  genres: [{
    type: String
  }],
  socialLinks: {
    website: String,
    instagram: String,
    twitter: String,
    facebook: String
  },
  revenueShare: {
    freeTier: {
      type: Number,
      default: 20 // percentage
    },
    proTier: {
      type: Number,
      default: 50 // percentage
    }
  },
  promoBalance: {
    type: Number,
    default: 25 // dollars
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ArtistProfile', ArtistProfileSchema);
