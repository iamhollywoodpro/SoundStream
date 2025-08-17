// Revenue Tracking Service
const RevenueShare = require('../models/revenueShare.model');
const FanInvestment = require('../models/fanInvestment.model');
const InvestmentCampaign = require('../models/investmentCampaign.model');
const mongoose = require('mongoose');

class RevenueTrackingService {
  /**
   * Record revenue for a campaign
   * @param {Object} revenueData - Revenue data
   * @returns {Promise<Array>} Created revenue shares
   */
  async recordRevenue(revenueData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { campaignId, artistId, revenueType, amount, period } = revenueData;
      
      // Get active investments for this campaign
      const investments = await FanInvestment.find({
        campaign: campaignId,
        status: 'ACTIVE',
        startDate: { $lte: new Date(period.endDate) },
        endDate: { $gte: new Date(period.startDate) }
      });
      
      if (investments.length === 0) {
        throw new Error('No active investments found for this campaign');
      }
      
      // Calculate total revenue share percentage
      const totalSharePercentage = investments.reduce((sum, inv) => sum + inv.revenueSharePercentage, 0);
      
      // Create revenue shares for each investor
      const revenueShares = [];
      
      for (const investment of investments) {
        // Calculate investor's share amount
        const shareAmount = (investment.revenueSharePercentage / 100) * amount;
        
        const revenueShare = new RevenueShare({
          investment: investment._id,
          investor: investment.investor,
          artist: artistId,
          campaign: campaignId,
          period,
          revenueType,
          totalRevenue: amount,
          sharePercentage: investment.revenueSharePercentage,
          shareAmount,
          status: 'CALCULATED'
        });
        
        await revenueShare.save({ session });
        revenueShares.push(revenueShare);
        
        // Update investment's total earnings
        investment.totalEarnings += shareAmount;
        await investment.save({ session });
      }
      
      await session.commitTransaction();
      session.endSession();
      
      return revenueShares;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  
  /**
   * Process revenue share payments
   * @param {Array} revenueShareIds - Revenue share IDs to process
   * @returns {Promise<Array>} Processed revenue shares
   */
  async processRevenueSharePayments(revenueShareIds) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const revenueShares = await RevenueShare.find({
        _id: { $in: revenueShareIds },
        status: 'CALCULATED'
      });
      
      if (revenueShares.length === 0) {
        throw new Error('No eligible revenue shares found');
      }
      
      // Process payments
      // In a real implementation, this would integrate with a payment processor
      const processedShares = [];
      
      for (const share of revenueShares) {
        // Simulate payment processing
        const paymentResult = {
          success: true,
          transactionId: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date()
        };
        
        if (paymentResult.success) {
          share.status = 'PAID';
          share.paymentDate = new Date();
          share.transactionId = paymentResult.transactionId;
          
          await share.save({ session });
          processedShares.push(share);
        } else {
          share.status = 'FAILED';
          await share.save({ session });
        }
      }
      
      await session.commitTransaction();
      session.endSession();
      
      return processedShares;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  
  /**
   * Get revenue shares for an investor
   * @param {string} investorId - Investor ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} List of revenue shares
   */
  async getInvestorRevenueShares(investorId, filters = {}) {
    const query = { investor: investorId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    return RevenueShare.find(query)
      .populate('artist', 'username artistProfile.artistName profileImage')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });
  }
  
  /**
   * Get investor revenue summary
   * @param {string} investorId - Investor ID
   * @returns {Promise<Object>} Investor revenue summary
   */
  async getInvestorRevenueSummary(investorId) {
    const revenueShares = await RevenueShare.find({ investor: investorId });
    
    const totalEarned = revenueShares.reduce((sum, share) => sum + share.shareAmount, 0);
    const paid = revenueShares
      .filter(share => share.status === 'PAID')
      .reduce((sum, share) => sum + share.shareAmount, 0);
    const pending = revenueShares
      .filter(share => ['CALCULATED', 'PENDING'].includes(share.status))
      .reduce((sum, share) => sum + share.shareAmount, 0);
    
    // Calculate revenue by type
    const revenueByType = {};
    revenueShares.forEach(share => {
      const type = share.revenueType.toLowerCase();
      revenueByType[type] = (revenueByType[type] || 0) + share.shareAmount;
    });
    
    // Get monthly trend (last 6 months)
    const monthlyTrend = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      const monthlyRevenue = revenueShares
        .filter(share => {
          const shareDate = new Date(share.createdAt);
          return shareDate >= month && shareDate <= monthEnd;
        })
        .reduce((sum, share) => sum + share.shareAmount, 0);
      
      monthlyTrend.push({
        month: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`,
        amount: monthlyRevenue
      });
    }
    
    return {
      totalEarned,
      paid,
      pending,
      revenueByType,
      monthlyTrend
    };
  }
  
  /**
   * Get revenue shares for an artist
   * @param {string} artistId - Artist ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} List of revenue shares
   */
  async getArtistRevenueShares(artistId, filters = {}) {
    const query = { artist: artistId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    return RevenueShare.find(query)
      .populate('investor', 'username profileImage')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });
  }
  
  /**
   * Get artist revenue summary
   * @param {string} artistId - Artist ID
   * @returns {Promise<Object>} Artist revenue summary
   */
  async getArtistRevenueSummary(artistId) {
    // Get all revenue shares for this artist
    const revenueShares = await RevenueShare.find({ artist: artistId });
    
    // Calculate total revenue
    const totalRevenue = revenueShares.reduce((sum, share) => sum + share.totalRevenue, 0);
    
    // Calculate total paid to investors
    const totalPaidToInvestors = revenueShares.reduce((sum, share) => sum + share.shareAmount, 0);
    
    // Calculate artist's earnings
    const artistEarnings = totalRevenue - totalPaidToInvestors;
    
    // Calculate revenue by type
    const revenueByType = {};
    revenueShares.forEach(share => {
      const type = share.revenueType.toLowerCase();
      revenueByType[type] = (revenueByType[type] || 0) + share.totalRevenue;
    });
    
    // Calculate revenue by campaign
    const revenueByCampaign = {};
    for (const share of revenueShares) {
      const campaignId = share.campaign.toString();
      revenueByCampaign[campaignId] = (revenueByCampaign[campaignId] || 0) + share.totalRevenue;
    }
    
    // Get campaign details
    const campaignDetails = [];
    for (const [campaignId, revenue] of Object.entries(revenueByCampaign)) {
      const campaign = await InvestmentCampaign.findById(campaignId, 'title');
      if (campaign) {
        campaignDetails.push({
          campaignId,
          title: campaign.title,
          revenue
        });
      }
    }
    
    // Get monthly trend (last 6 months)
    const monthlyTrend = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      const monthlyRevenue = revenueShares
        .filter(share => {
          const shareDate = new Date(share.createdAt);
          return shareDate >= month && shareDate <= monthEnd;
        })
        .reduce((sum, share) => sum + share.totalRevenue, 0);
      
      monthlyTrend.push({
        month: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`,
        amount: monthlyRevenue
      });
    }
    
    return {
      totalRevenue,
      artistEarnings,
      totalPaidToInvestors,
      revenueByType,
      revenueByCampaign: campaignDetails,
      monthlyTrend
    };
  }
}

module.exports = new RevenueTrackingService();
