const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, admin, staff } = require('../middleware/auth');

// Public routes
router.post('/', orderController.createOrder);

// Customer routes
router.get('/customer/:email', auth, orderController.getOrdersByCustomer);
router.post('/:id/cancel', auth, orderController.cancelOrder);

// Admin/Staff routes
router.get('/', auth, staff, orderController.getAllOrders);
router.get('/:id', auth, staff, orderController.getOrderById);
router.put('/:id/status', auth, staff, orderController.updateOrderStatus);

module.exports = router;
