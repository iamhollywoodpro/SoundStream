// Revenue Share Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RevenueShareSchema = new Schema({
  investment: {
    type: Schema.Types.ObjectId,
    ref: 'FanInvestment',
    required: true
  },
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
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  revenueType: {
    type: String,
    enum: ['STREAMING', 'DIRECT_SALES', 'MERCHANDISE', 'SYNC_LICENSING', 'LIVE_PERFORMANCE'],
    required: true
  },
  totalRevenue: {
    type: Number,
    required: true
  },
  sharePercentage: {
    type: Number,
    required: true
  },
  shareAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['CALCULATED', 'PENDING', 'PAID', 'FAILED'],
    default: 'CALCULATED'
  },
  paymentDate: {
    type: Date
  },
  transactionId: {
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
RevenueShareSchema.index({ investment: 1 });
RevenueShareSchema.index({ investor: 1, status: 1 });
RevenueShareSchema.index({ artist: 1, status: 1 });
RevenueShareSchema.index({ campaign: 1 });

// Pre-save hook to update the updatedAt field
RevenueShareSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RevenueShare', RevenueShareSchema);
