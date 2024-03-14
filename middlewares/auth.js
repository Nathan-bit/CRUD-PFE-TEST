/* const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate; */

const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // No token provided, redirect to login
    return res.redirect('/connection/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    req.userId = decoded.userId;
    req.role=decoded.role
    next();
  } catch (err) {
    // Invalid token, redirect to login
    res.redirect('/connection/login');
  }
};

module.exports = authenticate;