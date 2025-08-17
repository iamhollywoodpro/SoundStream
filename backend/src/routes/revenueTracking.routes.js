// Revenue Tracking Routes
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const revenueTrackingController = require('../controllers/revenueTracking.controller');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/revenue
// @desc    Record revenue for a campaign
// @access  Private (Artists only)
router.post(
  '/',
  protect,
  authorize('artist'),
  [
    check('campaignId', 'Campaign ID is required').not().isEmpty(),
    check('revenueType', 'Revenue type is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('period.startDate', 'Period start date is required').not().isEmpty(),
    check('period.endDate', 'Period end date is required').not().isEmpty()
  ],
  revenueTrackingController.recordRevenue
);

// @route   POST /api/revenue/process-payments
// @desc    Process revenue share payments
// @access  Private (Admin only)
router.post(
  '/process-payments',
  protect,
  authorize('admin'),
  [
    check('revenueShareIds', 'Revenue share IDs are required').isArray()
  ],
  revenueTrackingController.processRevenueSharePayments
);

// @route   GET /api/revenue/investor/me
// @desc    Get current investor's revenue shares
// @access  Private
router.get(
  '/investor/me',
  protect,
  revenueTrackingController.getMyRevenueShares
);

// @route   GET /api/revenue/investor/summary
// @desc    Get investor revenue summary
// @access  Private
router.get(
  '/investor/summary',
  protect,
  revenueTrackingController.getMyRevenueSummary
);

// @route   GET /api/revenue/artist/me
// @desc    Get current artist's revenue shares
// @access  Private (Artists only)
router.get(
  '/artist/me',
  protect,
  authorize('artist'),
  revenueTrackingController.getArtistRevenueShares
);

// @route   GET /api/revenue/artist/summary
// @desc    Get artist revenue summary
// @access  Private (Artists only)
router.get(
  '/artist/summary',
  protect,
  authorize('artist'),
  revenueTrackingController.getArtistRevenueSummary
);

module.exports = router;
