const jwt = require('jsonwebtoken');

/**
 * Generate Test JWT Token
 * 
 * This utility generates a valid JWT token for testing the API endpoints.
 * Use this token in the Authorization header: Bearer <token>
 */

// JWT Secret (same as in .env file)
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// Sample user data
const testUsers = {
  'user-001': {
    userId: 'user-001',
    email: 'john.smith@example.com',
    role: 'employee'
  },
  'user-002': {
    userId: 'user-002', 
    email: 'jane.doe@example.com',
    role: 'manager'
  },
  'user-003': {
    userId: 'user-003',
    email: 'bob.johnson@example.com', 
    role: 'admin'
  }
};

function generateToken(userId = 'user-002') {
  const user = testUsers[userId] || testUsers['user-002'];
  
  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  
  console.log('\n=== JWT Token Generated ===');
  console.log('User:', user);
  console.log('Token:', token);
  console.log('\nUse in Authorization header:');
  console.log(`Bearer ${token}`);
  console.log('\nCurl example:');
  console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3005/api/reports/report-001/signatures/status`);
  console.log('\n');
  
  return token;
}

// Generate token for the user in your request (user-002)
if (require.main === module) {
  const userId = process.argv[2] || 'user-002';
  generateToken(userId);
}

module.exports = { generateToken, testUsers };