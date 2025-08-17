const express = require('express');
const { uploadAudio, uploadCoverArt } = require('../controllers/upload.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Artist only routes
router.post('/audio/:id', protect, authorize('artist'), uploadAudio);
router.post('/cover/:id', protect, authorize('artist'), uploadCoverArt);

module.exports = router;
