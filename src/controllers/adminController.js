const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
require("dotenv").config();

// Admin login controller
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the admin user by username
    const adminUser = await Admin.findOne({ username });
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate an admin token
    const adminToken = jwt.sign({ userId: adminUser._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Admin login succesfull");
    res.status(200).json({ message: 'Admin login successful', token: adminToken });
  } catch (error) {
    res.status(500).json({ message: 'Admin login failed', error: error.message });
  }
};

// Admin signup controller
const adminSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    //console.log(username);

    // Check if admin with the same username already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = new Admin({
      username,
      password: hashedPassword
    });

    // Save the admin user to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin signup successful' });
  } catch (error) {
    res.status(500).json({ message: 'Admin signup failed', error: error.message });
  }
};

const Users = require('../models/Users');

// Get user list
const getUserList = async (req, res) => {
  try {
    const userList = await Users.find();
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user list', error: error.message });
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user details', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const updatedUser = await Users.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Block user
const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const blockedUser = await Users.findByIdAndUpdate(userId, { blocked: true }, { new: true });
    if (!blockedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(blockedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to block user', error: error.message });
  }
};

// Activate user
const activateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const activatedUser = await Users.findByIdAndUpdate(userId, { blocked: false }, { new: true });
    if (!activatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(activatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to activate user', error: error.message });
  }
};

//const LoginEntry = require('../models/LoginEntry');

const User = require('../models/Users');
const Login = require('../models/LoginEntry');

const getUserLoginList = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Retrieve the user's login list
      let loginList;
      if (userId) {
        // If the id parameter is provided, retrieve login list for a specific user
        const user = await Users.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        loginList = await Login.find({ userId: user._id });
      } else {
        // If the id parameter is not provided, retrieve login list for all users
        loginList = await Login.find();
      }
  
      res.status(200).json(loginList);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve user login list', error: error.message });
    }
  };
  

module.exports = {
  adminLogin,
  adminSignup,
  getUserList,
  getUserDetails,
  updateUser,
  blockUser,
  activateUser,
  getUserLoginList
};
