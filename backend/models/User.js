const db = require('../db');
const bcrypt = require('bcryptjs');

class User {
  static create(user, callback) {
    const { name, email, password, address, role } = user;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const query = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [name, email, hashedPassword, address, role], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findByEmail(email, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.execute(query, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findById(id, callback) {
    const query = 'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?';
    db.execute(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findAll(callback) {
    const query = 'SELECT id, name, email, address, role, created_at FROM users';
    db.execute(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static updatePassword(id, newPassword, callback) {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    db.execute(query, [hashedPassword, id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

module.exports = User;