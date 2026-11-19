const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, expiresIn = '24h') => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Decode JWT token without verification
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
