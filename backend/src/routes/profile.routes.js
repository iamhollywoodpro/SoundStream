const express = require('express');
const {
  getProfile,
  updateProfile,
  getArtistProfile,
  getFanProfile
} = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.get('/artist/:id', getArtistProfile);
router.get('/fan/:id', getFanProfile);

module.exports = router;
