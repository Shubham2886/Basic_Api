const express = require('express');
const authController = require('../controllers/authController');
const emailController = require('../controllers/emailController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Signup route
router.post('/signup', authMiddleware.checkExistingTempUser, authController.signup);

// Email verification route
router.post('/verify-email', authController.verifyEmail);

// Phone verification route
router.post('/verify-phone', authController.verifyPhone);

// Login route
router.post('/login', authController.login);

// Forgot password route
router.post('/forgot-password', authController.forgotPassword);

// Reset password route
router.post('/reset-password', authController.resetPassword);

// Resend verification email route
router.post('/resend-verification-email', authController.resendVerificationEmail);

// Resend verification phone route
router.post('/resend-verification-phone', authController.resendVerificationPhone);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;

