/**
 * Centralized error handling utilities
 */

const { logger } = require('./logger');

// Custom error class with status code
class AppError extends Error {
  constructor(message, statusCode, additionalInfo = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // This flag differentiates operational errors from programming errors
    this.additionalInfo = additionalInfo;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error categories
const ErrorTypes = {
  VALIDATION_ERROR: 'ValidationError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  RESOURCE_NOT_FOUND: 'ResourceNotFoundError',
  DATABASE_ERROR: 'DatabaseError',
  INTERNAL_SERVER_ERROR: 'InternalServerError',
  CLIENT_ERROR: 'ClientError',
  RATE_LIMIT_ERROR: 'RateLimitError',
  FILE_UPLOAD_ERROR: 'FileUploadError',
  PAYMENT_ERROR: 'PaymentError'
};

// Database error handlers
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists. Please use a different ${field}.`;
  return new AppError(message, 409);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => ({
    field: el.path,
    message: el.message
  }));
  const message = 'Validation failed';
  return new AppError(message, 400, { errors });
};

// JWT error handlers
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401, { expired: true });

// Development error response
const sendErrorDev = (err, req, res) => {
  // Log the full error in development
  logger.error('Development Error:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  return res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
    message: err.message,
    stack: err.stack,
    timestamp: err.timestamp,
    ...(err.additionalInfo && { ...err.additionalInfo })
  });
};

// Production error response
const sendErrorProd = (err, req, res) => {
  // Log operational errors
  if (err.isOperational) {
    logger.warn('Operational Error:', {
      error: err.message,
      statusCode: err.statusCode,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      timestamp: err.timestamp,
      ...(err.additionalInfo && { ...err.additionalInfo })
    });
  }

  // Log programming errors
  logger.error('Programming Error:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong! Please try again later.',
    timestamp: new Date().toISOString()
  });
};

// Function to handle operational errors
const handleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle different types of errors
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // Mongoose errors
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

  // JWT errors
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Send appropriate response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

// Wrap async functions to avoid try/catch blocks
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Handler for mongoose validation errors
const handleMongooseValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => ({
    field: err.path,
    message: err.message,
    value: err.value
  }));
  
  return new AppError('Validation error', 400, { errors });
};

// Handler for duplicate key errors
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  
  return new AppError(
    `Duplicate value for field '${field}': ${value}`, 
    400, 
    { errors: [{ field, message: 'Already exists', value }] }
  );
};

// Create error response
const createErrorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    status: 'error',
    message,
    timestamp: new Date().toISOString()
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

// 404 handler
const handleNotFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn('404 Error:', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  next(new AppError(message, 404));
};

// Unhandled rejection handler
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', {
    error: err.message,
    stack: err.stack,
    promise: promise
  });
  
  // Close server & exit process in production
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', {
    error: err.message,
    stack: err.stack
  });
  
  // Close server & exit process
  process.exit(1);
});

module.exports = {
  AppError,
  ErrorTypes,
  handleError,
  catchAsync,
  handleMongooseValidationError,
  handleDuplicateKeyError,
  createErrorResponse,
  handleNotFound
};