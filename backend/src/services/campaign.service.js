// Campaign Service
const InvestmentCampaign = require('../models/investmentCampaign.model');
const FanInvestment = require('../models/fanInvestment.model');
const mongoose = require('mongoose');

class CampaignService {
  /**
   * Create a new campaign
   * @param {Object} campaignData - Campaign data
   * @returns {Promise<Object>} Created campaign
   */
  async createCampaign(campaignData) {
    const campaign = new InvestmentCampaign({
      artist: campaignData.artistId,
      title: campaignData.title,
      shortDescription: campaignData.shortDescription,
      description: campaignData.description,
      coverImage: campaignData.coverImage,
      fundingGoal: campaignData.fundingGoal,
      minimumInvestment: campaignData.minimumInvestment,
      revenueSharePercentage: campaignData.revenueSharePercentage,
      revenueStreams: campaignData.revenueStreams,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      estimatedCompletionDate: campaignData.estimatedCompletionDate,
      status: 'DRAFT',
      perks: campaignData.perks || [],
      faqs: campaignData.faqs || []
    });
    
    await campaign.save();
    return campaign;
  }
  
  /**
   * Update a campaign
   * @param {string} campaignId - Campaign ID
   * @param {Object} campaignData - Campaign data
   * @returns {Promise<Object>} Updated campaign
   */
  async updateCampaign(campaignId, campaignData) {
    const campaign = await InvestmentCampaign.findById(campaignId);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    // Only allow updates if campaign is in DRAFT or PENDING_APPROVAL status
    if (!['DRAFT', 'PENDING_APPROVAL'].includes(campaign.status)) {
      throw new Error('Campaign cannot be updated in its current status');
    }
    
    // Update fields
    Object.keys(campaignData).forEach(key => {
      if (key !== '_id' && key !== 'artist' && key !== 'status' && key !== 'currentFunding' && key !== 'investorCount') {
        campaign[key] = campaignData[key];
      }
    });
    
    await campaign.save();
    return campaign;
  }
  
  /**
   * Submit campaign for approval
   * @param {string} campaignId - Campaign ID
   * @returns {Promise<Object>} Updated campaign
   */
  async submitCampaignForApproval(campaignId) {
    const campaign = await InvestmentCampaign.findById(campaignId);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    if (campaign.status !== 'DRAFT') {
      throw new Error('Only draft campaigns can be submitted for approval');
    }
    
    campaign.status = 'PENDING_APPROVAL';
    await campaign.save();
    
    return campaign;
  }
  
  /**
   * Approve campaign
   * @param {string} campaignId - Campaign ID
   * @returns {Promise<Object>} Updated campaign
   */
  async approveCampaign(campaignId) {
    const campaign = await InvestmentCampaign.findById(campaignId);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    if (campaign.status !== 'PENDING_APPROVAL') {
      throw new Error('Campaign is not pending approval');
    }
    
    campaign.status = 'ACTIVE';
    await campaign.save();
    
    return campaign;
  }
  
  /**
   * Get active campaigns
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} List of campaigns
   */
  async getActiveCampaigns(filters = {}) {
    const query = { status: 'ACTIVE' };
    
    if (filters.genre) {
      query['artist.artistProfile.genres'] = filters.genre;
    }
    
    if (filters.minFunding) {
      query.fundingGoal = { $gte: filters.minFunding };
    }
    
    if (filters.maxFunding) {
      query.fundingGoal = { ...query.fundingGoal, $lte: filters.maxFunding };
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { shortDescription: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    return InvestmentCampaign.find(query)
      .populate('artist', 'username artistProfile.artistName profileImage')
      .sort({ createdAt: -1 });
  }
  
  /**
   * Get trending campaigns
   * @returns {Promise<Array>} List of trending campaigns
   */
  async getTrendingCampaigns() {
    return InvestmentCampaign.find({ status: 'ACTIVE' })
      .populate('artist', 'username artistProfile.artistName profileImage')
      .sort({ investorCount: -1, currentFunding: -1 })
      .limit(6);
  }
  
  /**
   * Get nearly funded campaigns
   * @returns {Promise<Array>} List of nearly funded campaigns
   */
  async getNearlyFundedCampaigns() {
    const campaigns = await InvestmentCampaign.find({ status: 'ACTIVE' })
      .populate('artist', 'username artistProfile.artistName profileImage');
    
    // Calculate funding percentage and sort
    const sortedCampaigns = campaigns
      .map(campaign => {
        const fundingPercentage = (campaign.currentFunding / campaign.fundingGoal) * 100;
        return { ...campaign.toObject(), fundingPercentage };
      })
      .filter(campaign => campaign.fundingPercentage >= 70 && campaign.fundingPercentage < 100)
      .sort((a, b) => b.fundingPercentage - a.fundingPercentage)
      .slice(0, 6);
    
    return sortedCampaigns;
  }
  
  /**
   * Get campaign details
   * @param {string} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign details
   */
  async getCampaignDetails(campaignId) {
    const campaign = await InvestmentCampaign.findById(campaignId)
      .populate('artist', 'username artistProfile.artistName profileImage');
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    return campaign;
  }
  
  /**
   * Get artist campaigns
   * @param {string} artistId - Artist ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} List of campaigns
   */
  async getArtistCampaigns(artistId, filters = {}) {
    const query = { artist: artistId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    return InvestmentCampaign.find(query)
      .sort({ createdAt: -1 });
  }
  
  /**
   * Get artist summary
   * @param {string} artistId - Artist ID
   * @returns {Promise<Object>} Artist summary
   */
  async getArtistSummary(artistId) {
    const campaigns = await InvestmentCampaign.find({ artist: artistId });
    
    const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.currentFunding, 0);
    const activeCampaigns = campaigns.filter(campaign => ['ACTIVE', 'FUNDED'].includes(campaign.status)).length;
    
    // Calculate total investors (unique)
    const investments = await FanInvestment.find({ artist: artistId });
    const uniqueInvestors = new Set(investments.map(inv => inv.investor.toString())).size;
    
    // Calculate funding success rate
    const completedCampaigns = campaigns.filter(campaign => campaign.status === 'COMPLETED').length;
    const fundingSuccessRate = completedCampaigns > 0 
      ? Math.round((completedCampaigns / campaigns.length) * 100) 
      : 0;
    
    return {
      totalRaised,
      activeCampaigns,
      totalInvestors: uniqueInvestors,
      fundingSuccessRate,
      campaignCount: campaigns.length
    };
  }
}

module.exports = new CampaignService();
