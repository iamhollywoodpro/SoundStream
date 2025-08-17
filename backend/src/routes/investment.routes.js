// Investment Routes
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const investmentController = require('../controllers/investment.controller');
const { protect } = require('../middleware/auth');

// @route   POST /api/investments
// @desc    Create a new investment
// @access  Private
router.post(
  '/',
  protect,
  [
    check('campaignId', 'Campaign ID is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a number').isNumeric()
  ],
  investmentController.createInvestment
);

// @route   PUT /api/investments/:investmentId/confirm
// @desc    Confirm an investment after payment
// @access  Private
router.put(
  '/:investmentId/confirm',
  protect,
  investmentController.confirmInvestment
);

// @route   GET /api/investments/me
// @desc    Get current user's investments
// @access  Private
router.get(
  '/me',
  protect,
  investmentController.getMyInvestments
);

// @route   GET /api/investments/:investmentId
// @desc    Get investment by ID
// @access  Private
router.get(
  '/:investmentId',
  protect,
  investmentController.getInvestmentById
);

// @route   GET /api/investments/summary
// @desc    Get investor summary
// @access  Private
router.get(
  '/summary',
  protect,
  investmentController.getInvestorSummary
);

module.exports = router;
