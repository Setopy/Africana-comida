const { body, param } = require('express-validator');

// Menu item validation rules
const menuItemValidation = {
  create: [
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
      .isIn(['appetizer', 'main-course', 'dessert', 'beverage', 'side-dish'])
      .withMessage('Invalid category'),
    
    body('ingredients')
      .optional()
      .isArray()
      .withMessage('Ingredients must be an array'),
    
    body('allergens')
      .optional()
      .isArray()
      .withMessage('Allergens must be an array'),
    
    body('isVegetarian')
      .optional()
      .isBoolean()
      .withMessage('isVegetarian must be a boolean'),
    
    body('isVegan')
      .optional()
      .isBoolean()
      .withMessage('isVegan must be a boolean'),
    
    body('isGlutenFree')
      .optional()
      .isBoolean()
      .withMessage('isGlutenFree must be a boolean'),
    
    body('isAvailable')
      .optional()
      .isBoolean()
      .withMessage('isAvailable must be a boolean')
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
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
      .isIn(['appetizer', 'main-course', 'dessert', 'beverage', 'side-dish'])
      .withMessage('Invalid category'),
    
    body('isAvailable')
      .optional()
      .isBoolean()
      .withMessage('isAvailable must be a boolean')
  ],

  validateId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid menu item ID format')
  ]
};

module.exports = {
  menuItemValidation
};
