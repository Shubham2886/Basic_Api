// phoneController.js

// Import necessary dependencies
const twilio = require('twilio');

// Twilio client setup
const twilioClient = twilio(
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN'
);

// Send verification code via SMS
const sendVerificationCode = async (phone, verificationCode) => {
  try {
    await twilioClient.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: 'YOUR_TWILIO_PHONE_NUMBER',
      to: phone
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
  }
};

module.exports = {
  sendVerificationCode
};



