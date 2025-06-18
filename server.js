// server.js
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const batteryRoutes = require('./src/routes/batteryRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Body parser for JSON payloads
app.use(morgan('dev'));  // HTTP request logger

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/battery', batteryRoutes);

// Root endpoint for health check
app.get('/', (req, res) => {
  res.send('Battery Management System API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});