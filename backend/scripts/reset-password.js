const db = require('../db');
const bcrypt = require('bcryptjs');

const users = [
  { email: 'admin@example.com', password: 'Admin123!', role: 'admin' },
  { email: 'john@example.com', password: 'User123!', role: 'user' },
  { email: 'mike@example.com', password: 'Owner123!', role: 'store_owner' },
  { email: 'sarah@example.com', password: 'Owner123!', role: 'store_owner' }
];

users.forEach(user => {
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const query = 'UPDATE users SET password = ? WHERE email = ?';
  
  db.execute(query, [hashedPassword, user.email], (err, results) => {
    if (err) {
      console.error(`Error updating ${user.email}:`, err);
    } else {
      console.log(`Updated password for ${user.email}`);
    }
  });
});

console.log('Password reset completed');