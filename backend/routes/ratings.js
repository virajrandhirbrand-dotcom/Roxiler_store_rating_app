const express = require('express');
const Rating = require('../models/Rating');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get ratings for a store
router.get('/store/:storeId', (req, res) => {
  const storeId = req.params.storeId;

  Rating.findByStore(storeId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get ratings by a user
router.get('/user/:userId', authenticateToken, (req, res) => {
  const userId = req.params.userId;

  // Check if user is accessing their own ratings or is admin
  if (req.user.id != userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  Rating.findByUser(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Create or update rating
router.post('/', authenticateToken, (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  if (!store_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Valid store ID and rating (1-5) are required' });
  }

  Rating.create({ user_id, store_id, rating }, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save rating' });
    }
    res.json({ message: 'Rating saved successfully' });
  });
});

// Get total count of ratings
router.get('/count', (req, res) => {
  Rating.getCount((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ data: { count: results[0].count } });
  });
});

module.exports = router;