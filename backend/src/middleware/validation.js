const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('../utils/errorHandler');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));
    
    return next(new AppError('Validation failed', 400, { 
      errors: errorMessages 
    }));
  }
  next();
};

// Common validation rules
const commonRules = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  name: body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  phone: body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  mongoId: param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
};

// User validation rules
const userValidation = {
  register: [
    commonRules.name,
    commonRules.email,
    commonRules.password,
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    commonRules.phone,
    handleValidationErrors
  ],
  
  login: [
    commonRules.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors
  ],
  
  updateProfile: [
    commonRules.name,
    commonRules.phone,
    handleValidationErrors
  ],
  
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    commonRules.password,
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    handleValidationErrors
  ]
};

// Menu item validation rules
const menuValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Menu item name must be between 2 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    body('category')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Category must be between 2 and 50 characters'),
    body('ingredients')
      .optional()
      .isArray()
      .withMessage('Ingredients must be an array'),
    body('spicyLevel')
      .optional()
      .isInt({ min: 0, max: 5 })
      .withMessage('Spicy level must be between 0 and 5'),
    body('available')
      .optional()
      .isBoolean()
      .withMessage('Available must be a boolean'),
    handleValidationErrors
  ],
  
  update: [
    commonRules.mongoId,
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Menu item name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    body('category')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Category must be between 2 and 50 characters'),
    body('spicyLevel')
      .optional()
      .isInt({ min: 0, max: 5 })
      .withMessage('Spicy level must be between 0 and 5'),
    body('available')
      .optional()
      .isBoolean()
      .withMessage('Available must be a boolean'),
    handleValidationErrors
  ]
};

// Order validation rules
const orderValidation = {
  create: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    body('items.*.menuItem')
      .isMongoId()
      .withMessage('Invalid menu item ID'),
    body('items.*.quantity')
      .isInt({ min: 1, max: 50 })
      .withMessage('Quantity must be between 1 and 50'),
    body('deliveryAddress')
      .optional()
      .isObject()
      .withMessage('Delivery address must be an object'),
    body('deliveryAddress.street')
      .if(body('deliveryAddress').exists())
      .notEmpty()
      .withMessage('Street address is required'),
    body('deliveryAddress.city')
      .if(body('deliveryAddress').exists())
      .notEmpty()
      .withMessage('City is required'),
    body('deliveryAddress.postalCode')
      .if(body('deliveryAddress').exists())
      .notEmpty()
      .withMessage('Postal code is required'),
    body('orderType')
      .isIn(['pickup', 'delivery'])
      .withMessage('Order type must be either pickup or delivery'),
    handleValidationErrors
  ],
  
  updateStatus: [
    commonRules.mongoId,
    body('status')
      .isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
      .withMessage('Invalid order status'),
    handleValidationErrors
  ]
};

// Review validation rules
const reviewValidation = {
  create: [
    body('menuItem')
      .isMongoId()
      .withMessage('Invalid menu item ID'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Comment must be between 10 and 500 characters'),
    handleValidationErrors
  ],
  
  update: [
    commonRules.mongoId,
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Comment must be between 10 and 500 characters'),
    handleValidationErrors
  ]
};

// Query validation rules
const queryValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
  ],
  
  menuFilter: [
    query('category')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Category must be between 2 and 50 characters'),
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be a non-negative number'),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be a non-negative number'),
    query('spicyLevel')
      .optional()
      .isInt({ min: 0, max: 5 })
      .withMessage('Spicy level must be between 0 and 5'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Search term must be between 2 and 100 characters'),
    handleValidationErrors
  ]
};

module.exports = {
  userValidation,
  menuValidation,
  orderValidation,
  reviewValidation,
  queryValidation,
  handleValidationErrors,
  commonRules
};