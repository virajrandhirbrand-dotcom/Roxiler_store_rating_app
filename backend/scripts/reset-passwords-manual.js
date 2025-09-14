const db = require('../db');
const bcrypt = require('bcryptjs');

console.log('Resetting passwords manually...');

const users = [
  { email: 'admin@example.com', password: 'Admin123!' },
  { email: 'john@example.com', password: 'User123!' },
  { email: 'mike@example.com', password: 'Owner123!' },
  { email: 'sarah@example.com', password: 'Owner123!' }
];

users.forEach(user => {
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const query = 'UPDATE users SET password = ? WHERE email = ?';
  
  db.execute(query, [hashedPassword, user.email], (err, results) => {
    if (err) {
      console.error(`❌ Error updating ${user.email}:`, err.message);
    } else {
      console.log(`✅ Updated password for ${user.email}`);
      console.log(`   Plain: ${user.password}`);
      console.log(`   Hashed: ${hashedPassword}`);
    }
    
    // If this is the last user, show success message
    if (user.email === users[users.length - 1].email) {
      setTimeout(() => {
        console.log('\n🔑 Password reset completed!');
        console.log('Try logging in with these credentials:');
        users.forEach(u => console.log(`- ${u.email} / ${u.password}`));
      }, 500);
    }
  });
});