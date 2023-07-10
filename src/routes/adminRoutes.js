const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
// Route for admin login
router.post('/login', adminController.adminLogin);

// Route for admin signup
router.post('/signup', adminController.adminSignup);

const { adminLogin, protectedRoute, getUserList, getUserDetails, updateUser, blockUser, activateUser, getUserLoginList } = require('../controllers/adminController');
const { authenticateAdmin, authorizeAdmin } = require('../middleware/authMiddleware');

// Admin login route
router.post('/login', adminLogin);


// User routes
router.get('/users', authenticateAdmin, authorizeAdmin, getUserList);
router.get('/users/:id', authenticateAdmin, authorizeAdmin, getUserDetails);
router.patch('/users/:id', authenticateAdmin, authorizeAdmin, updateUser);
router.patch('/users/:id/block', authenticateAdmin, authorizeAdmin, blockUser);
router.patch('/users/:id/activate', authenticateAdmin, authorizeAdmin, activateUser);
router.get('/users/:id/login-list', authenticateAdmin, authorizeAdmin, getUserLoginList);
router.get('/users/login-list', authenticateAdmin, authorizeAdmin, getUserLoginList);

module.exports = router;

module.exports = router;

