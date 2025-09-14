const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { validateRegistration } = require('../middleware/validation');
const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '24h' }
  );
};

// Login route with enhanced debugging
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('\n=== LOGIN ATTEMPT ===');
  console.log('Email:', email);
  console.log('Password provided:', password);

  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Use direct database query for better debugging
  const query = 'SELECT * FROM users WHERE email = ?';
  db.execute(query, [email], (err, results) => {
    if (err) {
      console.log('❌ Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      console.log('❌ User not found in database');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    console.log('✅ User found:', user.email);
    console.log('Stored password hash:', user.password);
    
    // Check if password is already hashed
    const looksLikeHash = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
    console.log('Password looks hashed:', looksLikeHash);
    
    // Handle both hashed and plain text passwords
    let isMatch = false;
    
    if (looksLikeHash) {
      // Compare with bcrypt
      isMatch = bcrypt.compareSync(password, user.password);
      console.log('Bcrypt comparison result:', isMatch);
    } else {
      // Compare plain text
      isMatch = (password === user.password);
      console.log('Plain text comparison result:', isMatch);
      
      // If plain text matches, hash it and update the database
      if (isMatch) {
        console.log('⚠️ Password is stored in plain text, updating to hashed version...');
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        db.execute(updateQuery, [hashedPassword, user.id], (updateErr) => {
          if (updateErr) {
            console.log('❌ Failed to update password:', updateErr.message);
          } else {
            console.log('✅ Password updated to hashed version');
          }
        });
      }
    }

    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Login successful');
    
    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase()
      }
    });
  });
});

// Register route
router.post('/register', validateRegistration, (req, res) => {
  const { name, email, password, address } = req.body;

  console.log('\n=== REGISTRATION ATTEMPT ===');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Address:', address);

  // Check if user already exists
  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.execute(checkQuery, [email], (err, results) => {
    if (err) {
      console.log('❌ Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      console.log('❌ User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Create new user
    const insertQuery = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
    db.execute(insertQuery, [name, email, hashedPassword, address, 'user'], (err, results) => {
      if (err) {
        console.log('❌ Failed to create user:', err.message);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      console.log('✅ User created with ID:', results.insertId);

      // Get the newly created user
      db.execute('SELECT * FROM users WHERE id = ?', [results.insertId], (err, userResults) => {
        if (err) {
          console.log('❌ Error fetching new user:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }

        const user = userResults[0];
        const token = generateToken(user);
        
        console.log('✅ Registration successful');
        res.status(201).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.toLowerCase()
          }
        });
      });
    });
  });
});

// Debug endpoint to check users
router.get('/debug/users', (req, res) => {
  console.log('\n=== DEBUG: LISTING ALL USERS ===');
  
  const query = 'SELECT id, name, email, role, password, LENGTH(password) as password_length FROM users';
  db.execute(query, (err, results) => {
    if (err) {
      console.log('❌ Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    console.log(`Found ${results.length} users:`);
    results.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user.role}, password: ${user.password}`);
    });
    
    res.json(results);
  });
});

// Debug endpoint to reset passwords
router.post('/debug/reset-passwords', (req, res) => {
  console.log('\n=== DEBUG: RESETTING PASSWORDS ===');
  
  const users = [
    { email: 'admin@example.com', password: 'Admin123!' },
    { email: 'john@example.com', password: 'User123!' },
    { email: 'mike@example.com', password: 'Owner123!' },
    { email: 'sarah@example.com', password: 'Owner123!' }
  ];
  
  let completed = 0;
  const results = [];
  
  users.forEach(user => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    
    db.execute(query, [hashedPassword, user.email], (err, updateResults) => {
      if (err) {
        console.log(`❌ Error updating ${user.email}:`, err.message);
        results.push({ email: user.email, status: 'error', error: err.message });
      } else {
        console.log(`✅ Updated password for ${user.email}`);
        results.push({ email: user.email, status: 'success', password: user.password });
      }
      
      completed++;
      if (completed === users.length) {
        console.log('✅ Password reset completed');
        res.json({ message: 'Password reset completed', results });
      }
    });
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Auth API is working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;