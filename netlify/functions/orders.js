const { connectToDatabase } = require('./shared/mongodb');
const { Order, MenuItem, User } = require('./shared/models');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    await connectToDatabase();

    const { httpMethod, path, queryStringParameters } = event;
    const segments = path.split('/').filter(Boolean);
    const orderId = segments[segments.length - 1];

    switch (httpMethod) {
      case 'POST':
        if (path.includes('/cancel')) {
          // Cancel order
          const cancelOrderId = segments[segments.length - 2];
          const order = await Order.findById(cancelOrderId);
          
          if (!order) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'Order not found' })
            };
          }
          
          if (order.status !== 'pending' && order.status !== 'confirmed') {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ 
                message: 'Cannot cancel order that is already being prepared or delivered' 
              })
            };
          }
          
          order.status = 'cancelled';
          await order.save();
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(order)
          };
        } else {
          // Create new order
          const { customer, items, paymentMethod, deliveryInstructions } = JSON.parse(event.body);
          
          // Validate items and calculate total
          let totalAmount = 0;
          const orderItems = [];
          
          for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
              return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: `Menu item ${item.menuItem} not found` })
              };
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
          
          return {
            statusCode: 201,
            headers,
            body: JSON.stringify(savedOrder)
          };
        }

      case 'GET':
        if (path.includes('/customer/')) {
          // Get orders by customer email
          const email = segments[segments.indexOf('customer') + 1];
          const orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 });
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(orders)
          };
        } else if (orderId && orderId !== 'orders') {
          // Get single order
          const order = await Order.findById(orderId);
          if (!order) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'Order not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(order)
          };
        } else {
          // Get all orders
          const orders = await Order.find().sort({ createdAt: -1 });
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(orders)
          };
        }

      case 'PUT':
        if (path.includes('/status')) {
          // Update order status
          const statusOrderId = segments[segments.length - 2];
          const { status } = JSON.parse(event.body);
          
          const order = await Order.findByIdAndUpdate(
            statusOrderId,
            { status },
            { new: true, runValidators: true }
          );
          
          if (!order) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'Order not found' })
            };
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(order)
          };
        }
        break;

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Orders function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};