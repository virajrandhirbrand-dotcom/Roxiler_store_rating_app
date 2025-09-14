const db = require('../db');
const bcrypt = require('bcryptjs');

console.log('Setting up database...');

// SQL to create database and tables
const sql = `
CREATE DATABASE IF NOT EXISTS store_rating_app;
USE store_rating_app;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('admin', 'user', 'store_owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    store_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);
`;

// Execute the SQL to create tables
db.query(sql, (err, results) => {
  if (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
  
  console.log('Database tables created successfully');
  
  // Now insert the test users with properly hashed passwords
  insertTestUsers();
});

function insertTestUsers() {
  const users = [
    {
      name: 'System Administrator',
      email: 'admin@example.com',
      password: 'Admin123!',
      address: '123 Admin Street',
      role: 'admin'
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'User123!',
      address: '456 User Avenue',
      role: 'user'
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: 'Owner123!',
      address: '321 Owner Lane',
      role: 'store_owner'
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      password: 'Owner123!',
      address: '654 Business Blvd',
      role: 'store_owner'
    }
  ];

  // First, clear existing users
  db.query('DELETE FROM users', (err) => {
    if (err) {
      console.error('Error clearing users:', err);
      return;
    }

    console.log('Cleared existing users');
    
    // Insert new users with hashed passwords
    let usersInserted = 0;
    users.forEach(user => {
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      const query = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
      
      db.execute(query, [user.name, user.email, hashedPassword, user.address, user.role], (err, results) => {
        if (err) {
          console.error(`Error inserting ${user.email}:`, err);
        } else {
          console.log(`Inserted user: ${user.email}`);
        }
        
        usersInserted++;
        if (usersInserted === users.length) {
          console.log('Database setup completed!');
          console.log('\nTest users created:');
          users.forEach(u => console.log(`- ${u.email} / ${u.password} (${u.role})`));
          process.exit(0);
        }
      });
    });
  });
}