const mongoose = require('mongoose');
 
const User_Schema = new mongoose.Schema({
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phone_no: {
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
    kyc_status: {
        type: Boolean,       
        default: false
    },
    signup_method: {
        type: String
    },
    date_of_birth: {
        type: Date
    },
    address: {
        type: String
    },
    username: {
        type: String
    },
    blocked: {
        type: Boolean,
        default: false
      }, 
})

const users = new mongoose.model('users', User_Schema);
module.exports = users;