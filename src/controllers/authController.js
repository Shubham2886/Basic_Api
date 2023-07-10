const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const tusers = require('../models/Temp_users');
const LoginEntry = require('../models/LoginEntry');
const users = require('../models/Users');

// Signup controller
const signup = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      phone_no,
    } = req.body;

    // Check if user with the same email already exists
    const existingUser = await tusers.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a random 6-digit number for login_signup_otp-email
    const login_signup_otp_email = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate a random 6-digit number for login_signup_otp-phone
    const login_signup_otp_phone = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const blocked = false;

    // Create a new user
    const newUser = new tusers({
      fullname,
      email,
      password: hashedPassword,
      phone_no,
      login_signup_otp_email,
      login_signup_otp_phone,
      blocked,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'secret-key', { expiresIn: '1h' });

      // Create a new login entry
    const loginEntry = new LoginEntry({ userId: user._id });
    await loginEntry.save();

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Email verification controller
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    //console.log(verificationCode);
    // Find the temporary user by email
    const tempUser = await tusers.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(tempUser);
    console.log(tempUser.login_signup_otp_email == verificationCode);

    // Check if the verification code matches
    if (tempUser.login_signup_otp_email == verificationCode) {
        // Create a new user document using the temporary user data
        const newUser = new User({
            fullname: tempUser.fullname,
            email: tempUser.email,
            password: tempUser.password,
            phone_no: tempUser.phone_no,
            email_verified: true, // Set email_verified status for the new use
            status: true,
            kyc_status: false, // Initial value for kyc_status
            signup_method: '', // Initial value for signup_method
            date_of_birth: null, // Initial value for date_of_birth
            address: '', // Initial value for address
            username: '', // Initial value for username
          });
      // Hash the password using bcrypt for the new user
      //newUser.password = await bcrypt.hash(newUser.password, 10);


    
      // Save the new user to the main user collection
      await newUser.save();

      
      

      // Delete the temporary user
      await tusers.findByIdAndDelete(tempUser._id);

      return res.status(200).json({ message: 'Email verification successful' });
    }

    res.status(400).json({ message: 'Invalid verification code' });
  } catch (error) {
    res.status(500).json({ message: 'Email verification failed', error: error.message });
  }
};

// Phone verification controller
const verifyPhone = async (req, res) => {
  try {
    const { phone, verificationCode } = req.body;

    // Find the temporary user by phone number
    const tempUser = await User.findOne({ phone });
    if (!tempUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the verification code matches
    if (tempUser.login_signup_otp_phone == verificationCode) {
      // Update the temporary user's phone verification status
      tempUser.phone_verified = true;
      await tempUser.save();

      return res.status(200).json({ message: 'Phone verification successful' });
    }

    res.status(400).json({ message: 'Invalid verification code' });
  } catch (error) {
    res.status(500).json({ message: 'Phone verification failed', error: error.message });
  }
};


// Forgot password controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a random reset token
    const resetToken = jwt.sign({ userId: user._id }, 'reset-secret-key', { expiresIn: '1h' });

    // Save the reset token to the user document
    user.resetToken = resetToken;
    await user.save();

    // Send the reset password link to the user's email
    const mailOptions = {
      from: 'youremail@gmail.com',
      to: user.email,
      subject: 'Reset Password',
      text: `Click the following link to reset your password: http://your-website.com/reset-password?token=${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset password link sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Forgot password failed', error: error.message });
  }
};




// Reset password controller
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Verify the reset token
    const decodedToken = jwt.verify(resetToken, 'reset-secret-key');

    // Find the user by the decoded token's userId
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's password with the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined; // Clear the reset token
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
};

// Resend verification email controller
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the new verification code to the user document
    user.login_signup_otp_email = verificationCode;
    await user.save();

    // Send the verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to resend verification email', error: error.message });
  }
};

// Resend verification phone controller
const resendVerificationPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    // Find the user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the new verification code to the user document
    user.login_signup_otp_phone = verificationCode;
    await user.save();

    // Send the verification code to the user's phone
    // Implement your SMS sending logic here

    res.status(200).json({ message: 'Verification code sent to phone successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to resend verification code to phone', error: error.message });
  }
};


// Logout controller
const logout = async (req, res) => {
  try {
   
    req.session.destroy(); // Clear the user's session (if using session-based authentication)

    // Get the user ID from the authenticated user (assuming you have a userId property in the JWT payload)
    const userId = req.user.userId;

  
    // For example, update the user's last logout timestamp in the database
    const user = await User.findById(userId);
    if (user) {
      user.lastLogout = new Date();
      await user.save();
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};


module.exports = {
  signup,
  login,
  verifyEmail,
  verifyPhone,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  resendVerificationPhone,
  logout
};

