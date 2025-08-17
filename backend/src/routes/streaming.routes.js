const express = require('express');
const { streamAudio, getHLSManifest } = require('../controllers/streaming.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes with optional authentication
router.get('/:id', protect, streamAudio);
router.get('/:id/manifest.m3u8', protect, getHLSManifest);

module.exports = router;
