const db = require('../db');

class Rating {
  static create(rating, callback) {
    const { user_id, store_id, rating: ratingValue } = rating;
    const query = 'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?';
    db.execute(query, [user_id, store_id, ratingValue, ratingValue], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findByStore(storeId, callback) {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email 
      FROM ratings r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.store_id = ?
    `;
    db.execute(query, [storeId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findByUser(userId, callback) {
    const query = 'SELECT * FROM ratings WHERE user_id = ?';
    db.execute(query, [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static getAverageRating(storeId, callback) {
    const query = 'SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = ?';
    db.execute(query, [storeId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static getCount(callback) {
    const query = 'SELECT COUNT(*) as count FROM ratings';
    db.execute(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = Rating;