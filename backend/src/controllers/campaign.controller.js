// Campaign Controller
const campaignService = require('../services/campaign.service');
const { validationResult } = require('express-validator');

exports.createCampaign = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const campaignData = {
      ...req.body,
      artistId: req.user.id
    };

    const campaign = await campaignService.createCampaign(campaignData);
    
    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { campaignId } = req.params;
    const campaignData = req.body;

    // Verify ownership
    const campaign = await campaignService.getCampaignDetails(campaignId);
    if (campaign.artist.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this campaign'
      });
    }

    const updatedCampaign = await campaignService.updateCampaign(campaignId, campaignData);
    
    res.status(200).json({
      success: true,
      data: updatedCampaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.submitCampaignForApproval = async (req, res) => {
  try {
    const { campaignId } = req.params;

    // Verify ownership
    const campaign = await campaignService.getCampaignDetails(campaignId);
    if (campaign.artist.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this campaign'
      });
    }

    const updatedCampaign = await campaignService.submitCampaignForApproval(campaignId);
    
    res.status(200).json({
      success: true,
      data: updatedCampaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.approveCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve campaigns'
      });
    }

    const updatedCampaign = await campaignService.approveCampaign(campaignId);
    
    res.status(200).json({
      success: true,
      data: updatedCampaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getActiveCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.getActiveCampaigns(req.query);
    
    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getTrendingCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.getTrendingCampaigns();
    
    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getNearlyFundedCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.getNearlyFundedCampaigns();
    
    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCampaignDetails = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const campaign = await campaignService.getCampaignDetails(campaignId);
    
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyArtistCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.getArtistCampaigns(req.user.id, req.query);
    
    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getArtistSummary = async (req, res) => {
  try {
    const summary = await campaignService.getArtistSummary(req.user.id);
    
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
