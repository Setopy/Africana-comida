const { body } = require('express-validator');

const menuItemValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Menu item name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['appetizer', 'main', 'dessert', 'beverage', 'side'])
    .withMessage('Invalid category'),

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),

  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('Availability must be true or false'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be true or false'),

  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array'),

  body('spiceLevel')
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage('Spice level must be between 0 and 5'),

  body('preparationTime')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Preparation time must be a positive integer'),

  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array')
];

module.exports = {
  menuItemValidation
};