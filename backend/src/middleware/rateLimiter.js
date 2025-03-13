const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');

/**
 * Configurable rate limiter middleware
 * @param {Object} options - Rate limiter options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests in the time window
 * @param {string} options.message - Error message to send when limit is exceeded
 * @param {string} options.standardHeaders - Set standard rate limit headers (default: true)
 * @param {string} options.legacyHeaders - Set legacy rate limit headers (default: false)
 */
const rateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // Default: 15 minutes
    max: 100, // Default: 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.'
  };

  const limiterOptions = { ...defaultOptions, ...options };

  // Log rate limit hits
  limiterOptions.handler = (req, res, next, options) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.headers['user-agent']
    });
    
    res.status(429).json({
      status: 'error',
      message: options.message
    });
  };

  return rateLimit(limiterOptions);
};

module.exports = rateLimiter;