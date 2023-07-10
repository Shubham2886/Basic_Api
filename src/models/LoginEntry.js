const mongoose = require('mongoose');

const loginEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const LoginEntry = mongoose.model('LoginEntry', loginEntrySchema);

module.exports = LoginEntry;
