// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.register); // <-- THIS IS THE NEW LINE

// Route for logging in an existing user
router.post('/login', authController.login);

module.exports = router;