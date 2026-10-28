const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes by verifying JWT Bearer token and attaching the user document
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // Fetch user from DB and omit password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized: User no longer exists'));
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized: Invalid or expired token'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized: No token provided'));
  }
};

module.exports = {
  protect,
};
