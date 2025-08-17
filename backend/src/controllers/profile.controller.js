const ArtistProfile = require('../models/artistProfile.model');
const FanProfile = require('../models/fanProfile.model');
const User = require('../models/user.model');

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    let profile;
    
    if (req.user.userType === 'artist') {
      profile = await ArtistProfile.findOne({ user: req.user.id });
      
      if (!profile) {
        // Create profile if it doesn't exist
        profile = await ArtistProfile.create({ user: req.user.id });
      }
    } else {
      profile = await FanProfile.findOne({ user: req.user.id });
      
      if (!profile) {
        // Create profile if it doesn't exist
        profile = await FanProfile.create({ user: req.user.id });
      }
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    let profile;
    
    if (req.user.userType === 'artist') {
      profile = await ArtistProfile.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      profile = await FanProfile.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get artist profile by ID
// @route   GET /api/profile/artist/:id
// @access  Public
exports.getArtistProfile = async (req, res, next) => {
  try {
    const profile = await ArtistProfile.findOne({ user: req.params.id }).populate('user', 'username profileImage');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get fan profile by ID
// @route   GET /api/profile/fan/:id
// @access  Public
exports.getFanProfile = async (req, res, next) => {
  try {
    const profile = await FanProfile.findOne({ user: req.params.id }).populate('user', 'username profileImage');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
