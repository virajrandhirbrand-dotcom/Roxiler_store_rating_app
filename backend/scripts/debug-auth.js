const db = require('../db');
const bcrypt = require('bcryptjs');

console.log('=== AUTH DEBUG SCRIPT ===\n');

// Test the specific credentials that are failing
const testCredentials = [
  { email: 'admin@example.com', password: 'Admin123!' },
  { email: 'john@example.com', password: 'User123!' },
  { email: 'mike@example.com', password: 'Owner123!' }
];

// Check if users exist and test password verification
db.query('SELECT id, name, email, password, role FROM users', (err, results) => {
  if (err) {
    console.error('❌ Error fetching users:', err.message);
    process.exit(1);
  }
  
  console.log(`📊 Found ${results.length} users in database:`);
  console.log('============================================');
  
  results.forEach(user => {
    console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    console.log(`Password Hash: ${user.password}`);
    console.log('---');
  });
  
  console.log('\n🔐 Testing password verification:');
  console.log('================================');
  
  testCredentials.forEach(cred => {
    const user = results.find(u => u.email === cred.email);
    
    if (!user) {
      console.log(`❌ User not found: ${cred.email}`);
      return;
    }
    
    console.log(`\nTesting: ${cred.email} / ${cred.password}`);
    const isMatch = bcrypt.compareSync(cred.password, user.password);
    console.log(`Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
    
    if (!isMatch) {
      console.log(`💡 Try hashing the password manually:`);
      const hashed = bcrypt.hashSync(cred.password, 10);
      console.log(`bcrypt.hashSync("${cred.password}", 10) = ${hashed}`);
      console.log(`Compare with stored hash: ${user.password}`);
    }
  });
  
  process.exit(0);
});