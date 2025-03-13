const { body } = require('express-validator');

// Registration validation
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    .withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

// Login validation
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

// Password change validation
exports.passwordValidation = [
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    .withMessage('New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

// Profile update validation
exports.updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object'),
  
  body('preferences.spicyLevel')
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage('Spicy level must be between 0 and 5'),
  
  body('preferences.favoriteCategories')
    .optional()
    .isArray()
    .withMessage('Favorite categories must be an array'),
  
  body('preferences.dietaryRestrictions')
    .optional()
    .isArray()
    .withMessage('Dietary restrictions must be an array'),
  
  body('preferences.allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array')
];

// Address validation
exports.addressValidation = [
  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean value')
];