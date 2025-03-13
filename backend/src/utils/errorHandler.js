/**
 * Centralized error handling utilities
 */

// Custom error class with status code
class AppError extends Error {
  constructor(message, statusCode, additionalInfo = {}) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // This flag differentiates operational errors from programming errors
    this.additionalInfo = additionalInfo;
    
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
  RATE_LIMIT_ERROR: 'RateLimitError'
};

// Function to handle operational errors
const handleError = (err, req, res, next) => {
  // Default to 500 if statusCode is not defined
  const statusCode = err.statusCode || 500;
  
  // Determine if it's an operational error we can handle
  const isOperational = err.isOperational === true;
  
  // Format response based on environment
  const responseBody = {
    status: 'error',
    message: isOperational ? err.message : 'Something went wrong'
  };
  
  // Add validation errors if present
  if (err.additionalInfo && err.additionalInfo.errors) {
    responseBody.errors = err.additionalInfo.errors;
  }
  
  // In development, add more details
  if (process.env.NODE_ENV === 'development') {
    if (!isOperational) {
      responseBody.message = err.message;
      responseBody.error = err;
      responseBody.stack = err.stack;
    }
  }
  
  // Send the error response
  res.status(statusCode).json(responseBody);
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
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  ErrorTypes,
  handleError,
  catchAsync,
  handleMongooseValidationError,
  handleDuplicateKeyError,
  createErrorResponse
};