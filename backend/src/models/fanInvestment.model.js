// Fan Investment Model
// Path: /backend/src/models/fanInvestment.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Fan Investment Schema
 * Tracks investments made by fans in artists
 */
const FanInvestmentSchema = new Schema({
  investor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'InvestmentCampaign',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 10 // Minimum $10 investment
  },
  revenueSharePercentage: {
    type: Number,
    required: true,
    min: 0.01,
    max: 5.0 // Between 0.01% and 5%
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REFUNDED'],
    default: 'PENDING'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  lastPayoutDate: {
    type: Date
  },
  contractUrl: {
    type: String
  },
  notes: {
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
});

// Index for efficient querying
FanInvestmentSchema.index({ investor: 1, artist: 1, campaign: 1 });
FanInvestmentSchema.index({ campaign: 1, status: 1 });
FanInvestmentSchema.index({ artist: 1, status: 1 });

// Pre-save hook to update the updatedAt field
FanInvestmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get active investments for an investor
FanInvestmentSchema.statics.getActiveInvestments = async function(investorId) {
  return this.find({
    investor: investorId,
    status: 'ACTIVE'
  })
  .populate('artist', 'username artistProfile.artistName profileImage')
  .populate('campaign', 'title description fundingGoal currentFunding')
  .sort({ createdAt: -1 });
};

// Static method to get active investments for an artist
FanInvestmentSchema.statics.getArtistInvestments = async function(artistId) {
  return this.find({
    artist: artistId,
    status: 'ACTIVE'
  })
  .populate('investor', 'username profileImage')
  .populate('campaign', 'title description fundingGoal currentFunding')
  .sort({ createdAt: -1 });
};

// Static method to get investments for a campaign
FanInvestmentSchema.statics.getCampaignInvestments = async function(campaignId) {
  return this.find({
    campaign: campaignId
  })
  .populate('investor', 'username profileImage')
  .sort({ amount: -1 });
};

// Static method to calculate total investment amount for a campaign
FanInvestmentSchema.statics.calculateCampaignTotal = async function(campaignId) {
  const result = await this.aggregate([
    { $match: { campaign: mongoose.Types.ObjectId(campaignId), status: { $in: ['PENDING', 'ACTIVE'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

// Static method to calculate total earnings for an investor
FanInvestmentSchema.statics.calculateInvestorEarnings = async function(investorId) {
  const result = await this.aggregate([
    { $match: { investor: mongoose.Types.ObjectId(investorId) } },
    { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

module.exports = mongoose.model('FanInvestment', FanInvestmentSchema);
