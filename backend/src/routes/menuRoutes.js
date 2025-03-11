const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { auth, admin } = require('../middleware/auth');

// Public routes
router.get('/', menuController.getAllItems);
router.get('/featured', menuController.getFeaturedItems);
router.get('/category/:category', menuController.getItemsByCategory);
router.get('/:id', menuController.getItemById);

// Protected routes (admin only)
router.post('/', auth, admin, menuController.createItem);
router.put('/:id', auth, admin, menuController.updateItem);
router.delete('/:id', auth, admin, menuController.deleteItem);

module.exports = router;
