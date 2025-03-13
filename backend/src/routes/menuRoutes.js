const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { auth, admin } = require('../middleware/auth');
const { apiCache } = require('../middleware/cache');
const validate = require('../middleware/validator');
const { menuItemValidation } = require('../validators/menuValidator');

// Public routes with caching
router.get('/', apiCache(3600), menuController.getAllItems); // Cache for 1 hour
router.get('/featured', apiCache(3600), menuController.getFeaturedItems);
router.get('/category/:category', apiCache(1800), menuController.getItemsByCategory); // Cache for 30 minutes
router.get('/country/:country', apiCache(1800), menuController.getItemsByCountry);
router.get('/:id', apiCache(1800), menuController.getItemById);

// Protected routes (admin only) - no caching for mutable operations
router.post(
  '/',
  auth,
  admin,
  validate(menuItemValidation),
  menuController.createItem
);

router.put(
  '/:id',
  auth,
  admin,
  validate(menuItemValidation),
  menuController.updateItem
);

router.delete(
  '/:id',
  auth,
  admin,
  menuController.deleteItem
);

router.put(
  '/:id/availability',
  auth,
  admin,
  menuController.toggleAvailability
);

// Route for getting menu item statistics
router.get(
  '/:id/stats',
  apiCache(1800),
  menuController.getItemStats
);

module.exports = router;