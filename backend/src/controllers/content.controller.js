const Content = require('../models/content.model');
const ArtistProfile = require('../models/artistProfile.model');

// @desc    Create new content
// @route   POST /api/content
// @access  Private (Artists only)
exports.createContent = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.artist = req.user.id;
    
    // Check if user is an artist
    if (req.user.userType !== 'artist') {
      return res.status(403).json({
        success: false,
        error: 'Only artists can create content'
      });
    }
    
    const content = await Content.create(req.body);
    
    res.status(201).json({
      success: true,
      data: content
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all content
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Content.find(JSON.parse(queryStr)).populate('artist', 'username profileImage');
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Content.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const content = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: content.length,
      pagination,
      data: content
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single content
// @route   GET /api/content/:id
// @access  Public
exports.getContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id).populate('artist', 'username profileImage');
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private
exports.updateContent = async (req, res, next) => {
  try {
    let content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    // Make sure user is content owner
    if (content.artist.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this content'
      });
    }
    
    content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private
exports.deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    // Make sure user is content owner
    if (content.artist.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this content'
      });
    }
    
    await content.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get content by artist
// @route   GET /api/content/artist/:id
// @access  Public
exports.getArtistContent = async (req, res, next) => {
  try {
    const content = await Content.find({ artist: req.params.id }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
