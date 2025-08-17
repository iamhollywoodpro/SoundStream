// Investment Controller
const investmentService = require('../services/investment.service');
const { validationResult } = require('express-validator');

exports.createInvestment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const investmentData = {
      investorId: req.user.id,
      campaignId: req.body.campaignId,
      amount: req.body.amount
    };

    const investment = await investmentService.createInvestment(investmentData);
    
    res.status(201).json({
      success: true,
      data: investment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.confirmInvestment = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const paymentResult = req.body.paymentResult;

    const investment = await investmentService.confirmInvestment(investmentId, paymentResult);
    
    res.status(200).json({
      success: true,
      data: investment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyInvestments = async (req, res) => {
  try {
    const investments = await investmentService.getInvestorInvestments(req.user.id, req.query);
    
    res.status(200).json({
      success: true,
      count: investments.length,
      data: investments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getInvestmentById = async (req, res) => {
  try {
    const { investmentId } = req.params;
    
    const investment = await investmentService.getInvestmentById(investmentId);
    
    // Check if user is authorized to view this investment
    if (investment.investor.toString() !== req.user.id && 
        investment.artist.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this investment'
      });
    }
    
    res.status(200).json({
      success: true,
      data: investment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getInvestorSummary = async (req, res) => {
  try {
    const summary = await investmentService.getInvestorSummary(req.user.id);
    
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
