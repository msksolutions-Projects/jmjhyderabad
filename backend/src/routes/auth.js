const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  logout,
  getCurrentAdmin,
  changePassword,
  verifyToken,
  setupStatus,
} = require('../controllers/authController');

const router = express.Router();

// Slows down password guessing: at most 20 sign-in or setup attempts per visitor every 15 minutes.
const signInLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Please wait 15 minutes and try again.' },
});

// Public routes
router.get('/setup-status', setupStatus);
router.post('/register', signInLimit, register);
router.post('/login', signInLimit, login);

// Signed-in routes
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentAdmin);
router.post('/change-password', protect, changePassword);
router.get('/verify', protect, verifyToken);

module.exports = router;
