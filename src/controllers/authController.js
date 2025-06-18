// src/controllers/authController.js
const dbPool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// (This is the new function)
// src/controllers/authController.js

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const [existingUsers] = await dbPool.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Username already taken.' });
    }
    
    // Check this section carefully
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt); // Is 'password_hash' spelled correctly?

    // *** THE MOST LIKELY PLACE FOR AN ERROR IS THIS QUERY ***
    const query = 'INSERT INTO users (username, password_hash) VALUES (?, ?)'; // Check for typos here!
    
    // And check the variables here
    await dbPool.execute(query, [username, password_hash]);

    res.status(201).json({ message: 'User created successfully. You can now log in.' });

  } catch (error) {
    // This catch block is what's sending the "Internal Server Error" to Postman
    console.error('Registration error:', error); // The REAL error is printed here in your terminal
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ... your login function follows ...

// (This is your existing login function - no changes needed)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const [rows] = await dbPool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};