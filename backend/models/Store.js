const db = require('../db');

class Store {
  static create(store, callback) {
    const { name, email, address, owner_id } = store;
    const query = 'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)';
    db.execute(query, [name, email, address, owner_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findAll(callback) {
    const query = `
      SELECT s.*, AVG(r.rating) as average_rating, u.name as owner_name
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      LEFT JOIN users u ON s.owner_id = u.id
      GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at, u.name
    `;
    db.execute(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findByOwner(ownerId, callback) {
    const query = `
      SELECT s.*, AVG(r.rating) as average_rating 
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      WHERE s.owner_id = ? 
      GROUP BY s.id
    `;
    db.execute(query, [ownerId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static search(query, callback) {
    const searchQuery = `
      SELECT s.*, AVG(r.rating) as average_rating 
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      WHERE s.name LIKE ? OR s.address LIKE ?
      GROUP BY s.id
    `;
    db.execute(searchQuery, [`%${query}%`, `%${query}%`], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = Store;