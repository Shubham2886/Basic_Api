const tusers = require('../models/Temp_users');

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

module.exports = {
  checkExistingTempUser,
};
