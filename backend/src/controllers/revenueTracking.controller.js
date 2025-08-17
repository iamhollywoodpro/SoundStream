// Revenue Tracking Controller
const revenueTrackingService = require('../services/revenueTracking.service');
const { validationResult } = require('express-validator');

exports.recordRevenue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const revenueData = {
      ...req.body,
      artistId: req.user.id
    };

    const revenueShares = await revenueTrackingService.recordRevenue(revenueData);
    
    res.status(201).json({
      success: true,
      count: revenueShares.length,
      data: revenueShares
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.processRevenueSharePayments = async (req, res) => {
  try {
    const { revenueShareIds } = req.body;

    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to process payments'
      });
    }

    const processedShares = await revenueTrackingService.processRevenueSharePayments(revenueShareIds);
    
    res.status(200).json({
      success: true,
      count: processedShares.length,
      data: processedShares
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyRevenueShares = async (req, res) => {
  try {
    const revenueShares = await revenueTrackingService.getInvestorRevenueShares(req.user.id, req.query);
    
    res.status(200).json({
      success: true,
      count: revenueShares.length,
      data: revenueShares
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyRevenueSummary = async (req, res) => {
  try {
    const summary = await revenueTrackingService.getInvestorRevenueSummary(req.user.id);
    
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

exports.getArtistRevenueShares = async (req, res) => {
  try {
    const revenueShares = await revenueTrackingService.getArtistRevenueShares(req.user.id, req.query);
    
    res.status(200).json({
      success: true,
      count: revenueShares.length,
      data: revenueShares
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getArtistRevenueSummary = async (req, res) => {
  try {
    const summary = await revenueTrackingService.getArtistRevenueSummary(req.user.id);
    
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
