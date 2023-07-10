const nodemailer = require('nodemailer');

// Function to send verification email
const sendVerificationEmail = async (email, verificationCode) => {
  try {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'YOUR_GMAIL_EMAIL', // Replace with your Gmail email address
        pass: 'YOUR_GMAIL_PASSWORD', // Replace with your Gmail app-specific password
      },
    });

    // Define the email message
    const mailOptions = {
      from: 'SENDER_NAME <YOUR_GMAIL_EMAIL>', // Replace with the sender's name and your Gmail email address
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

module.exports = {
  sendVerificationEmail,
};
