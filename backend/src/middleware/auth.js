const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const { AppError } = require('../utils/errorHandler');
const { logger } = require('../utils/logger');

exports.auth = async (req, res, next) => {
  try {
    // Check for token in Authorization header or cookies
    let token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next(new AppError('Authentication required', 401));
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 401));
    }
    
    // Check if user is active
    if (!user.active) {
      return next(new AppError('User account has been deactivated', 401));
    }
    
    // Attach user to request
    req.user = decoded;
    req.userDocument = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401, { expired: true }));
    } else if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    } else {
      logger.error('Auth middleware error:', { error: error.message });
      return next(new AppError('Authentication failed', 401));
    }
  }
};

exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Admin access denied', 403));
  }
  next();
};

exports.staff = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return next(new AppError('Staff access denied', 403));
  }
  next();
};

exports.owner = (req, res, next) => {
  const resourceId = req.params.id || req.params.userId;
  if (req.user.role !== 'admin' && req.user.id !== resourceId) {
    return next(new AppError('Access denied: You can only modify your own resources', 403));
  }
  next();
};

// Generate JWT tokens
exports.generateTokens = async (user, ipAddress, userAgent) => {
  const RefreshToken = require('../models/RefreshToken');
  
  // Create access token
  const accessToken = jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      name: user.name
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRATION }
  );
  
  // Create refresh token
  const refreshTokenExpiry = new Date(
    Date.now() + 
    (config.JWT_REFRESH_EXPIRATION.includes('d') 
      ? parseInt(config.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000 
      : 7 * 24 * 60 * 60 * 1000) // Default 7 days if format is invalid
  );
  
  // Generate random token
  const crypto = require('crypto');
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  // Save refresh token to database
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    ip: ipAddress,
    userAgent: userAgent,
    expires: refreshTokenExpiry
  });
  
  return { 
    accessToken, 
    refreshToken, 
    refreshTokenExpiry 
  };
};