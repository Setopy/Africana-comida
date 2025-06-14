const { connectToDatabase } = require('./shared/mongodb');

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
    console.log('Health check starting...');
    
    // Check environment variables
    const envCheck = {
      hasMongoURI: !!process.env.MONGODB_URI,
      mongoURILength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      hasJWTSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      availableEnvVars: Object.keys(process.env).filter(key => 
        key.startsWith('MONGODB') || key.startsWith('JWT') || key.startsWith('NODE')
      )
    };

    console.log('Environment check:', envCheck);

    // Test MongoDB connection
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      await connectToDatabase();
      dbStatus = 'connected';
      console.log('Database connection successful');
    } catch (error) {
      dbStatus = 'failed';
      dbError = error.message;
      console.error('Database connection failed:', error);
    }

    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError
      },
      netlify: {
        functionName: context.functionName,
        functionVersion: context.functionVersion,
        awsRequestId: context.awsRequestId
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(healthStatus, null, 2)
    };

  } catch (error) {
    console.error('Health check error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        status: 'error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  }
};