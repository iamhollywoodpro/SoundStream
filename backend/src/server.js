require('dotenv').config();
console.log('Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- SUNO_API_KEY exists:', process.env.SUNO_API_KEY ? 'YES' : 'NO');
console.log('- SUNO_API_KEY starts with:', process.env.SUNO_API_KEY ? process.env.SUNO_API_KEY.substring(0, 5) + '...' : 'undefined');
console.log('- SUNO_API_URL:', process.env.SUNO_API_URL);

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { AIARService } = require('./services/aiAR/aiAR.service');
const { AIManagerService } = require('./services/aiManager/aiManager.service');
const { BillboardAnalyzer } = require('./services/billboard/billboardAnalyzer');
const { AudioProcessor } = require('./services/audio/audioProcessor');
const { SyncEngine } = require('./services/sync/syncEngine');
const dotenv = require('dotenv');
const musicTestRoutes = require('./routes/enhancedMusicTest.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Set up simple logger for debugging
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  debug: (message) => console.log(`[DEBUG] ${message}`),
  warn: (message) => console.warn(`[WARNING] ${message}`)
};

// SUNO API Configuration
const SUNO_API_KEY = process.env.SUNO_API_KEY;
const SUNO_API_URL = process.env.SUNO_API_URL || 'https://api.sunoapi.org/api/v1';

// Log SUNO API configuration
logger.info(`SUNO API URL: ${SUNO_API_URL}`);
logger.info(`SUNO API Key available: ${!!SUNO_API_KEY}`);

// Initialize SUNO API with URL
console.log(`Initializing SUNO API with URL: ${SUNO_API_URL}`);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/music-test', musicTestRoutes);

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp3|wav|m4a|flac|aac|ogg/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Initialize services
const aiAR = new AIARService();
const aiManager = new AIManagerService();
const billboardAnalyzer = new BillboardAnalyzer();
const audioProcessor = new AudioProcessor();
const syncEngine = new SyncEngine();

// In-memory storage for demo (use database in production)
let tracks = [];
let analyses = [];
let submissions = [];

// Start AI A&R background scanning
aiAR.startBackgroundScanning();
console.log('🔄 AI A&R background scanning started');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'SoundStream AI A&R Platform Running!', 
    port: PORT,
    timestamp: new Date(),
    services: {
      aiAR: aiAR.isRunning,
      aiManager: aiManager.isActive,
      billboard: billboardAnalyzer.isConnected,
      sync: syncEngine.isActive,
      suno: !!SUNO_API_KEY
    }
  });
});

// Track upload and AI A&R analysis
app.post('/api/analyze-track', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    console.log(`🎵 AI A&R Processing: ${req.file.originalname}`);

    // Create track record
    const track = {
      id: uuidv4(),
      title: req.body.title || req.file.originalname,
      artist: req.body.artist || 'Unknown Artist',
      audioUrl: `/uploads/${req.file.filename}`,
      duration: 0,
      fileSize: req.file.size,
      uploadDate: new Date(),
      genre: req.body.genre || 'Unknown',
      filePath: req.file.path
    };

    tracks.push(track);

    // 🎯 AI A&R BACKGROUND ANALYSIS
    console.log('🎯 AI A&R analyzing track for hit potential...');
    const arAnalysis = await aiAR.analyzeTrack(track, req.file);
    
    // 📊 Billboard Chart Analysis
    console.log('📊 Running Billboard Chart comparison...');
    const billboardComparison = await billboardAnalyzer.compareToCharts(arAnalysis);
    
    // 🎵 Audio Processing Analysis
    console.log('🎵 Processing audio features...');
    const audioFeatures = await audioProcessor.extractFeatures(req.file.path);
    
    // Combine analysis results
    const analysis = {
      ...arAnalysis,
      billboardComparison,
      audioFeatures,
      trackId: track.id,
      analysisDate: new Date()
    };

    analyses.push(analysis);

    // 🎭 AI Manager gets notified about the analysis
    console.log('🎭 AI Manager processing results...');
    await aiManager.processNewAnalysis(analysis);

    // 🎬 Find sync opportunities
    console.log('🎬 Finding sync opportunities...');
    const syncOpportunities = await syncEngine.findOpportunities(analysis);
    analysis.syncOpportunities = syncOpportunities;

    console.log(`✅ Track analyzed: ${track.title} - Hit Potential: ${analysis.hitPotential}%`);

    res.json(analysis);
  } catch (error) {
    console.error('🚨 Track analysis error:', error);
    res.status(500).json({ error: 'Track analysis failed', details: error.message });
  }
});

// AI Manager chat endpoint
app.post('/api/ai-manager', async (req, res) => {
  try {
    const { message, trackAnalysis } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`🎭 AI Manager processing: "${message}"`);
    
    const response = await aiManager.generateResponse(message, trackAnalysis);
    
    console.log('✅ AI Manager response generated');
    res.json(response);
  } catch (error) {
    console.error('🚨 AI Manager error:', error);
    res.status(500).json({ error: 'AI Manager response failed', details: error.message });
  }
});

// Get sync opportunities
app.post('/api/sync-opportunities', async (req, res) => {
  try {
    const trackAnalysis = req.body;
    
    if (!trackAnalysis) {
      return res.status(400).json({ error: 'Track analysis is required' });
    }

    console.log('🎬 Finding sync opportunities...');
    const opportunities = await syncEngine.findOpportunities(trackAnalysis);
    
    console.log(`✅ Found ${opportunities.length} sync opportunities`);
    res.json(opportunities);
  } catch (error) {
    console.error('🚨 Sync opportunities error:', error);
    res.status(500).json({ error: 'Failed to get sync opportunities', details: error.message });
  }
});

// Submit to sync opportunities
app.post('/api/sync-submit', async (req, res) => {
  try {
    const { trackId, opportunityIds, userConsent } = req.body;
    
    if (!trackId || !opportunityIds || !userConsent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`🚀 Submitting track ${trackId} to ${opportunityIds.length} opportunities`);
    
    // Process submissions through sync engine
    const submissionResults = await syncEngine.submitToOpportunities(trackId, opportunityIds);
    
    // Store submissions
    submissions.push(...submissionResults);
    
    console.log('✅ Submissions processed successfully');
    res.json({
      success: true,
      submissions: submissionResults.map(s => s.id),
      message: `Successfully submitted to ${opportunityIds.length} opportunities`
    });
  } catch (error) {
    console.error('🚨 Sync submission error:', error);
    res.status(500).json({ error: 'Sync submission failed', details: error.message });
  }
});

// Get user tracks
app.get('/api/tracks', (req, res) => {
  try {
    res.json(tracks);
  } catch (error) {
    console.error('🚨 Get tracks error:', error);
    res.status(500).json({ error: 'Failed to get tracks' });
  }
});

// Get user analyses
app.get('/api/analyses', (req, res) => {
  try {
    res.json(analyses);
  } catch (error) {
    console.error('🚨 Get analyses error:', error);
    res.status(500).json({ error: 'Failed to get analyses' });
  }
});

// Get submissions
app.get('/api/submissions', (req, res) => {
  try {
    res.json(submissions);
  } catch (error) {
    console.error('🚨 Get submissions error:', error);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
});

// Billboard charts endpoint
app.get('/api/billboard/charts', async (req, res) => {
  try {
    const charts = await billboardAnalyzer.getCurrentCharts();
    res.json(charts);
  } catch (error) {
    console.error('🚨 Billboard charts error:', error);
    res.status(500).json({ error: 'Failed to get Billboard charts' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
  }
  
  console.error('🚨 Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down AI A&R background scanning...');
  aiAR.stopBackgroundScanning();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 SoundStream AI A&R Platform running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 AI A&R Analysis: POST http://localhost:${PORT}/api/analyze-track`);
  console.log(`🎭 AI Manager: POST http://localhost:${PORT}/api/ai-manager`);
  console.log(`🎬 Sync opportunities: POST http://localhost:${PORT}/api/sync-opportunities`);
  console.log(`📈 Billboard charts: GET http://localhost:${PORT}/api/billboard/charts`);
  console.log(`🎵 AI Lyrics: POST http://localhost:${PORT}/api/ai/lyrics`);
  console.log(`🎵 AI Music Generation: POST http://localhost:${PORT}/api/ai/music/generate`);
});

module.exports = app;