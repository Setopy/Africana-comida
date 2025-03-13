const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, deliveryInstructions } = 
req.body;
    
    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${item.menuItem} 
not found` });
      }
      
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price
      });
      
      totalAmount += menuItem.price * item.quantity;
    }
    
    // Create the order
    const newOrder = new Order({
      customer,
      items: orderItems,
      totalAmount,
      paymentMethod,
      deliveryInstructions,
      estimatedDelivery: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    });
    
    const savedOrder = await newOrder.save();
    
    // If user is logged in, add order to their history
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { orderHistory: savedOrder._id }
      });
    }
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get orders by customer email
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ 'customer.email': email }).sort({ 
createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow cancellation of pending or confirmed orders
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ 
        message: 'Cannot cancel order that is already being prepared or delivered' 
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
