const express = require('express');
const {
  createContent,
  getAllContent,
  getContent,
  updateContent,
  deleteContent,
  getArtistContent
} = require('../controllers/content.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getAllContent)
  .post(protect, authorize('artist'), createContent);

router.route('/:id')
  .get(getContent)
  .put(protect, updateContent)
  .delete(protect, deleteContent);

router.get('/artist/:id', getArtistContent);

module.exports = router;
