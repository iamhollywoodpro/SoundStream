// Campaign Routes
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const campaignController = require('../controllers/campaign.controller');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private (Artists only)
router.post(
  '/',
  protect,
  authorize('artist'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('shortDescription', 'Short description is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('fundingGoal', 'Funding goal is required and must be a number').isNumeric(),
    check('minimumInvestment', 'Minimum investment is required and must be a number').isNumeric(),
    check('revenueSharePercentage', 'Revenue share percentage is required and must be a number').isNumeric(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty(),
    check('estimatedCompletionDate', 'Estimated completion date is required').not().isEmpty()
  ],
  campaignController.createCampaign
);

// @route   PUT /api/campaigns/:campaignId
// @desc    Update a campaign
// @access  Private (Campaign owner only)
router.put(
  '/:campaignId',
  protect,
  authorize('artist'),
  campaignController.updateCampaign
);

// @route   PUT /api/campaigns/:campaignId/submit
// @desc    Submit campaign for approval
// @access  Private (Campaign owner only)
router.put(
  '/:campaignId/submit',
  protect,
  authorize('artist'),
  campaignController.submitCampaignForApproval
);

// @route   PUT /api/campaigns/:campaignId/approve
// @desc    Approve a campaign
// @access  Private (Admin only)
router.put(
  '/:campaignId/approve',
  protect,
  authorize('admin'),
  campaignController.approveCampaign
);

// @route   GET /api/campaigns
// @desc    Get active campaigns
// @access  Public
router.get(
  '/',
  campaignController.getActiveCampaigns
);

// @route   GET /api/campaigns/trending
// @desc    Get trending campaigns
// @access  Public
router.get(
  '/trending',
  campaignController.getTrendingCampaigns
);

// @route   GET /api/campaigns/nearly-funded
// @desc    Get nearly funded campaigns
// @access  Public
router.get(
  '/nearly-funded',
  campaignController.getNearlyFundedCampaigns
);

// @route   GET /api/campaigns/:campaignId
// @desc    Get campaign details
// @access  Public
router.get(
  '/:campaignId',
  campaignController.getCampaignDetails
);

// @route   GET /api/campaigns/artist/me
// @desc    Get current artist's campaigns
// @access  Private (Artists only)
router.get(
  '/artist/me',
  protect,
  authorize('artist'),
  campaignController.getMyArtistCampaigns
);

// @route   GET /api/campaigns/artist/summary
// @desc    Get artist summary
// @access  Private (Artists only)
router.get(
  '/artist/summary',
  protect,
  authorize('artist'),
  campaignController.getArtistSummary
);

module.exports = router;
