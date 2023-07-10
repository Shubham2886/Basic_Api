require("dotenv").config();
require("../src/config/db").connect();
const express = require('express');

const mongoose = require('mongoose');
const authRoutes = require('../src/routes/authRroute');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import middleware
const authMiddleware = require('./middleware/authMiddleware');

// Routes
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });