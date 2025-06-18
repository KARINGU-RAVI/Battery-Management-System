// src/routes/batteryRoutes.js
const express = require('express');
const router = express.Router();
const batteryController = require('../controllers/batteryController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public endpoint to receive data from vehicles
router.post('/data', batteryController.storeData);

// Protected endpoints for data retrieval
router.get('/:id', verifyToken, batteryController.getBatteryData);
router.get('/:id/:field', verifyToken, batteryController.getBatteryFieldData);

module.exports = router;