const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Add this test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Backend connection successful!' });
});


module.exports = router;
// Add this to your auth.routes.js file
router.get('/test', (req, res) => {
  res.json({ message: 'Backend connection successful!' });
});
