const axios = require('axios');

const testLogin = async (email, password) => {
  try {
    console.log(`\nTesting login: ${email} / ${password}`);
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    
    return true;
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data.error);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
};

// Test all credentials
const testAllLogins = async () => {
  console.log('🧪 Testing all login credentials...\n');
  
  const credentials = [
    { email: 'admin@example.com', password: 'Admin123!' },
    { email: 'john@example.com', password: 'User123!' },
    { email: 'mike@example.com', password: 'Owner123!' }
  ];
  
  for (const cred of credentials) {
    await testLogin(cred.email, cred.password);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
};

// Start the tests
testAllLogins();