exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  console.log('Test function called successfully');
  console.log('Event:', JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Function is working!',
      timestamp: new Date().toISOString(),
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        headers: event.headers
      },
      environment: {
        nodeVersion: process.version,
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        allEnvKeys: Object.keys(process.env).filter(key => 
          key.startsWith('MONGODB') || key.startsWith('JWT') || key.startsWith('NODE')
        )
      }
    }, null, 2)
  };
};