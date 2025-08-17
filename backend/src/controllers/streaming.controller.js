const Content = require('../models/content.model');
const fs = require('fs');
const path = require('path');

// @desc    Stream audio content
// @route   GET /api/streaming/:id
// @access  Public
exports.streamAudio = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    // Check if content is exclusive and user is not subscribed
    if (content.isExclusive && (!req.user || req.user.subscription.tier !== 'pro')) {
      return res.status(403).json({
        success: false,
        error: 'This content is exclusive to pro tier subscribers'
      });
    }
    
    // Determine quality based on user subscription or query param
    let quality = 'low'; // default to low quality (128kbps)
    
    if (req.query.quality === 'high' || (req.user && req.user.subscription.tier === 'pro')) {
      quality = 'high'; // high quality (320kbps)
    }
    
    // For demo purposes, we'll use a placeholder path
    // In production, this would be a path to the actual audio file or a CDN URL
    const audioPath = content.streamingUrl[quality] || content.streamingUrl.low;
    
    // If we're serving local files (development only)
    if (process.env.NODE_ENV === 'development' && content.storagePath && content.storagePath[quality]) {
      const filePath = path.join(__dirname, '../../uploads', content.storagePath[quality]);
      
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;
        
        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;
          const file = fs.createReadStream(filePath, {start, end});
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg',
          };
          
          res.writeHead(206, head);
          file.pipe(res);
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
          };
          
          res.writeHead(200, head);
          fs.createReadStream(filePath).pipe(res);
        }
        
        // Record stream for analytics and revenue sharing
        recordStream(req.params.id, req.user ? req.user.id : null, quality);
        
        return;
      }
    }
    
    // If we're using CDN or the file doesn't exist locally
    if (audioPath) {
      // Record stream for analytics and revenue sharing
      recordStream(req.params.id, req.user ? req.user.id : null, quality);
      
      // Redirect to the CDN URL
      return res.redirect(audioPath);
    }
    
    return res.status(404).json({
      success: false,
      error: 'Audio file not found'
    });
    
  } catch (err) {
    console.error('Streaming error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get HLS manifest for adaptive streaming
// @route   GET /api/streaming/:id/manifest.m3u8
// @access  Public
exports.getHLSManifest = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    // Check if content is exclusive and user is not subscribed
    if (content.isExclusive && (!req.user || req.user.subscription.tier !== 'pro')) {
      return res.status(403).json({
        success: false,
        error: 'This content is exclusive to pro tier subscribers'
      });
    }
    
    // Generate a basic HLS manifest
    const manifest = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=128000,RESOLUTION=1x1
/api/streaming/${content._id}/playlist_128k.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=320000,RESOLUTION=1x1
/api/streaming/${content._id}/playlist_320k.m3u8
`;
    
    res.set('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(manifest);
    
  } catch (err) {
    console.error('HLS manifest error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Helper function to record stream for analytics and revenue sharing
const recordStream = async (contentId, userId, quality) => {
  try {
    // Increment stream count on content
    await Content.findByIdAndUpdate(contentId, {
      $inc: { streamCount: 1 }
    });
    
    // In a production environment, we would also:
    // 1. Create a stream record in a Stream model
    // 2. Update artist revenue based on the stream
    // 3. Update user rewards if they're a fan
    
    console.log(`Stream recorded: Content ID ${contentId}, User ID ${userId || 'anonymous'}, Quality: ${quality}`);
    
  } catch (err) {
    console.error('Error recording stream:', err);
  }
};
