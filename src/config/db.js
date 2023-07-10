require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const app = express()







exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch(err => {
            console.log("database connection failed. exiting now...");
            console.error(err);
            process.exit(1)
        })
}