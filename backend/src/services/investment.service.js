// Investment Service
const FanInvestment = require('../models/fanInvestment.model');
const InvestmentCampaign = require('../models/investmentCampaign.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

class InvestmentService {
  /**
   * Create a new investment
   * @param {Object} investmentData - Investment data
   * @returns {Promise<Object>} Created investment
   */
  async createInvestment(investmentData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Verify campaign exists and is active
      const campaign = await InvestmentCampaign.findById(investmentData.campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      
      if (campaign.status !== 'ACTIVE') {
        throw new Error('Campaign is not active');
      }
      
      // Verify minimum investment amount
      if (investmentData.amount < campaign.minimumInvestment) {
        throw new Error(`Minimum investment amount is $${campaign.minimumInvestment}`);
      }
      
      // Calculate revenue share percentage based on investment amount
      // This is a simplified calculation - you may want to implement a more complex formula
      const revenueSharePercentage = (investmentData.amount / campaign.fundingGoal) * campaign.revenueSharePercentage;
      
      // Create investment
      const investment = new FanInvestment({
        investor: investmentData.investorId,
        artist: campaign.artist,
        campaign: campaign._id,
        amount: investmentData.amount,
        revenueSharePercentage,
        status: 'PENDING',
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)), // 5-year term
      });
      
      await investment.save({ session });
      
      // Update campaign funding
      campaign.currentFunding += investmentData.amount;
      campaign.investorCount += 1;
      
      // Check if campaign is now fully funded
      if (campaign.currentFunding >= campaign.fundingGoal) {
        campaign.status = 'FUNDED';
      }
      
      await campaign.save({ session });
      
      await session.commitTransaction();
      session.endSession();
      
      return investment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  
  /**
   * Confirm an investment after payment
   * @param {string} investmentId - Investment ID
   * @param {Object} paymentResult - Payment result
   * @returns {Promise<Object>} Updated investment
   */
  async confirmInvestment(investmentId, paymentResult) {
    const investment = await FanInvestment.findById(investmentId);
    
    if (!investment) {
      throw new Error('Investment not found');
    }
    
    if (investment.status !== 'PENDING') {
      throw new Error('Investment is not in pending status');
    }
    
    // Update investment status
    investment.status = 'ACTIVE';
    investment.paymentDetails = paymentResult;
    
    await investment.save();
    
    return investment;
  }
  
  /**
   * Get investments for an investor
   * @param {string} investorId - Investor ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} List of investments
   */
  async getInvestorInvestments(investorId, filters = {}) {
    const query = { investor: investorId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    return FanInvestment.find(query)
      .populate('artist', 'username artistProfile.artistName profileImage')
      .populate('campaign', 'title shortDescription fundingGoal currentFunding')
      .sort({ createdAt: -1 });
  }
  
  /**
   * Get investor summary
   * @param {string} investorId - Investor ID
   * @returns {Promise<Object>} Investor summary
   */
  async getInvestorSummary(investorId) {
    const investments = await FanInvestment.find({ investor: investorId });
    
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const activeInvestments = investments.filter(inv => inv.status === 'ACTIVE').length;
    const totalEarnings = investments.reduce((sum, inv) => sum + inv.totalEarnings, 0);
    
    return {
      totalInvested,
      activeInvestments,
      totalEarnings,
      investmentCount: investments.length
    };
  }
}

module.exports = new InvestmentService();
