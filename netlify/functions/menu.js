const { connectToDatabase } = require('./shared/mongodb');
const { MenuItem } = require('./shared/models');

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

    const { httpMethod, path } = event;
    const segments = path.split('/').filter(Boolean);
    const menuId = segments[segments.length - 1];

    switch (httpMethod) {
      case 'GET':
        if (menuId && menuId !== 'menu') {
          // Get single menu item
          const item = await MenuItem.findById(menuId);
          if (!item) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, message: 'Item not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: item })
          };
        } else {
          // Get all menu items
          const items = await MenuItem.find({ isAvailable: true });
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: items })
          };
        }

      case 'POST':
        // Create new menu item
        const newItem = await MenuItem.create(JSON.parse(event.body));
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: newItem })
        };

      case 'PUT':
        // Update menu item
        const updatedItem = await MenuItem.findByIdAndUpdate(
          menuId,
          JSON.parse(event.body),
          { new: true }
        );
        if (!updatedItem) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, message: 'Item not found' })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: updatedItem })
        };

      case 'DELETE':
        // Delete menu item
        const deletedItem = await MenuItem.findByIdAndDelete(menuId);
        if (!deletedItem) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, message: 'Item not found' })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Item deleted' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Menu function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Server error' })
    };
  }
};