const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Content = require('../models/content.model');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for audio files
const audioFilter = (req, file, cb) => {
  // Accept audio files only
  if (!file.originalname.match(/\.(mp3|wav|ogg|m4a)$/)) {
    return cb(new Error('Only audio files are allowed!'), false);
  }
  cb(null, true);
};

// Initialize upload middleware
const upload = multer({
  storage: storage,
  fileFilter: audioFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// @desc    Upload audio file
// @route   POST /api/upload/audio/:id
// @access  Private (Artists only)
exports.uploadAudio = (req, res) => {
  // Use multer upload middleware
  const uploadMiddleware = upload.single('audio');
  
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file uploaded'
      });
    }
    
    try {
      // Get content ID from params
      const contentId = req.params.id;
      
      // Find content
      const content = await Content.findById(contentId);
      
      if (!content) {
        // Remove uploaded file if content not found
        fs.unlinkSync(req.file.path);
        
        return res.status(404).json({
          success: false,
          error: 'Content not found'
        });
      }
      
      // Check if user is the content owner
      if (content.artist.toString() !== req.user.id) {
        // Remove uploaded file if user is not the owner
        fs.unlinkSync(req.file.path);
        
        return res.status(401).json({
          success: false,
          error: 'Not authorized to upload audio for this content'
        });
      }
      
      // In a production environment, we would:
      // 1. Process the audio file to create different quality versions
      // 2. Upload to a CDN or cloud storage
      // 3. Update the content with the URLs
      
      // For now, we'll just update the content with the local file path
      const relativePath = path.relative(path.join(__dirname, '../../uploads'), req.file.path);
      
      // Update content with file path
      content.storagePath = {
        low: relativePath,
        high: relativePath // Same file for now, would be different in production
      };
      
      // Set streaming URLs for local development
      content.streamingUrl = {
        low: `/api/streaming/${contentId}?quality=low`,
        high: `/api/streaming/${contentId}?quality=high`
      };
      
      await content.save();
      
      res.status(200).json({
        success: true,
        data: {
          filename: req.file.filename,
          contentId: contentId,
          streamingUrl: content.streamingUrl
        }
      });
      
    } catch (err) {
      console.error('Upload error:', err);
      
      // Remove uploaded file if there's an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  });
};

// @desc    Upload cover art
// @route   POST /api/upload/cover/:id
// @access  Private (Artists only)
exports.uploadCoverArt = (req, res) => {
  // Similar implementation for cover art uploads
  // Would use a different file filter for images
  res.status(501).json({
    success: false,
    error: 'Not implemented yet'
  });
};
