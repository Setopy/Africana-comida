exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('Menu-simple function called');
    console.log('Environment check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'not found',
      nodeEnv: process.env.NODE_ENV
    });

    // Test mongoose import
    let mongooseStatus = 'not tested';
    try {
      const mongoose = require('mongoose');
      mongooseStatus = 'imported successfully';
      console.log('Mongoose imported successfully');
    } catch (err) {
      mongooseStatus = `import failed: ${err.message}`;
      console.error('Mongoose import failed:', err);
    }

    // Return sample menu data for now
    const sampleMenu = [
      {
        _id: '1',
        name: 'Sample Jollof Rice',
        description: 'Traditional Nigerian spiced rice dish',
        price: 15.99,
        category: 'main',
        isAvailable: true
      },
      {
        _id: '2', 
        name: 'Sample Suya',
        description: 'Grilled spiced meat skewers',
        price: 12.99,
        category: 'starters',
        isAvailable: true
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: sampleMenu,
        debug: {
          functionWorking: true,
          mongooseStatus,
          timestamp: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    console.error('Menu-simple function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error',
        error: error.message,
        stack: error.stack
      })
    };
  }
};