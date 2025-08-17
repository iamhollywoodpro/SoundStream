// Investment Campaign Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvestmentCampaignSchema = new Schema({
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },
  fundingGoal: {
    type: Number,
    required: true,
    min: 1000
  },
  currentFunding: {
    type: Number,
    default: 0
  },
  minimumInvestment: {
    type: Number,
    required: true,
    min: 10
  },
  revenueSharePercentage: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  revenueStreams: {
    streaming: {
      type: Boolean,
      default: true
    },
    directSales: {
      type: Boolean,
      default: true
    },
    merchandise: {
      type: Boolean,
      default: false
    },
    syncLicensing: {
      type: Boolean,
      default: false
    },
    livePerformance: {
      type: Boolean,
      default: false
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  estimatedCompletionDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'FUNDED', 'COMPLETED', 'CANCELLED'],
    default: 'DRAFT'
  },
  investorCount: {
    type: Number,
    default: 0
  },
  perks: [{
    tier: {
      type: String,
      required: true
    },
    minimumInvestment: {
      type: Number,
      required: true
    },
    items: [String]
  }],
  updates: [{
    title: {
      type: String
    },
    content: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  faqs: [{
    question: {
      type: String
    },
    answer: {
      type: String
    }
  }],
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
InvestmentCampaignSchema.index({ artist: 1, status: 1 });
InvestmentCampaignSchema.index({ status: 1, endDate: 1 });

// Pre-save hook to update the updatedAt field
InvestmentCampaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InvestmentCampaign', InvestmentCampaignSchema);
