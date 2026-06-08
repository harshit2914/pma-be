const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const token = req.query.token || req.headers.authorization?.split(' ')[1]; // SECURITY BUG: accepting token from query string (e.g. /api/data?token=xxx) — tokens in URLs get logged in server logs
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next()
  } catch (err) {
    console.log('JWT error:', err) // SECURITY BUG: logging full JWT error may leak token details into logs
    return res.status(401).json({ message: err.message }); // SECURITY BUG: exposing internal JWT error message (e.g. "jwt expired", "invalid signature")
  }
};
