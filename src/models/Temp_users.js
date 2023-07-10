const mongoose = require('mongoose');
 
const Temp_User_Schema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    fullname: {
        type: String
    },
    phone_no: {
        type: Number
    },
    login_signup_otp_email: {
        type: Number
    },
    login_signup_otp_phone: {
        type: Number
    },
    email_verified: {
        type: Boolean,   
        default: false
    },
    phone_verified: {
        type: Boolean,   
        default: false
    },
    status: {
        type: Boolean,       
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
      },

})

const tusers = new mongoose.model('tusers', Temp_User_Schema);
module.exports = tusers;