// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify the connection on startup
pool.getConnection()
  .then(connection => {
    console.log('Connected to the MySQL database!');
    connection.release();
  })
  .catch(err => {
    console.error('ERROR: Could not connect to MySQL database. Check your .env file and ensure MySQL is running.');
    console.error('Error details:', err.message);
  });

module.exports = pool;