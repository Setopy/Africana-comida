const { validationResult } = require('express-validator');
const { AppError } = require('../utils/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Validation middleware that checks validation results from express-validator
 * @param {Array} validations - Array of express-validator validation chains
 * @returns {Function} Express middleware function
 */
const validate = validations => {
  return async (req, res, next) => {
    try {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));
      
      // Get validation errors
      const errors = validationResult(req);
      
      // If no errors, continue
      if (errors.isEmpty()) {
        return next();
      }
      
      // Format validation errors
      const formattedErrors = errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }));
      
      // Log validation errors
      logger.debug('Validation failed', { 
        path: req.path, 
        method: req.method, 
        errors: formattedErrors
      });
      
      // Return validation errors
      return next(new AppError('Validation failed', 400, { errors: formattedErrors }));
    } catch (error) {
      // If validator throws an exception
      logger.error('Validation error:', { error: error.message });
      return next(new AppError('Validation processing failed', 500));
    }
  };
};

module.exports = validate;
