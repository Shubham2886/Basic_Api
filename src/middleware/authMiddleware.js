const tusers = require('../models/Temp_users');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Middleware to check if the user already exists in the temporary users collection
const checkExistingTempUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingTempUser = await tusers.findOne({ email });
    if (existingTempUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Missing authorization token' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const adminId = decodedToken.userId;
    let adminUser = await Admin.findById(adminId);

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update the isAdmin field to true
    adminUser.isAdmin = true;
    await adminUser.save();

    req.adminUser = adminUser;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authorization token' });
  }
};


const authorizeAdmin = (req, res, next) => {
  if (!req.adminUser.isAdmin) {
    return res.status(403).json({ message: 'Admin not authorized' });
  }

  next();
};

module.exports = {
  authenticateAdmin,
  authorizeAdmin,
  checkExistingTempUser,
};
