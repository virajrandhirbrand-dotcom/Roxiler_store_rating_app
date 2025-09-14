const db = require('../db');
const bcrypt = require('bcryptjs');

console.log('Checking users in database...');

db.query('SELECT id, name, email, password, role FROM users', (err, results) => {
  if (err) {
    console.error('Error fetching users:', err);
    process.exit(1);
  }
  
  console.log(`Found ${results.length} users:`);
  console.log('================================');
  
  results.forEach(user => {
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Password Hash: ${user.password}`);
    console.log(`Role: ${user.role}`);
    console.log('--------------------------------');
  });
  
  // Test password verification
  if (results.length > 0) {
    const testUser = results[0];
    console.log('Testing password verification:');
    console.log(`Testing password "Admin123!" for ${testUser.email}`);
    
    const isMatch = bcrypt.compareSync('Admin123!', testUser.password);
    console.log(`Password match: ${isMatch}`);
  }
  
  process.exit(0);
});