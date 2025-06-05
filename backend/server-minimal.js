// EMERGENCY MINIMAL SERVER FOR RENDER DEPLOYMENT DEBUGGING
// This server isolates the core functionality to identify startup issues

console.log('🚀 MINIMAL SERVER STARTING...');
console.log('📅 Timestamp:', new Date().toISOString());
console.log('🌍 Node Environment:', process.env.NODE_ENV || 'undefined');
console.log('🔌 Port from env:', process.env.PORT || 'undefined');

try {
  console.log('📦 Loading Express...');
  const express = require('express');
  console.log('✅ Express loaded successfully');

  console.log('🏗️ Creating Express app...');
  const app = express();
  console.log('✅ Express app created');

  // Basic middleware
  console.log('⚙️ Setting up basic middleware...');
  app.use(express.json());
  console.log('✅ JSON middleware added');

  // Environment variable check with detailed logging
  console.log('🔍 Checking environment variables...');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
  console.log('- PORT:', process.env.PORT || 'NOT SET');
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET (length: ' + process.env.MONGODB_URI.length + ')' : 'NOT SET');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET (length: ' + process.env.JWT_SECRET.length + ')' : 'NOT SET');

  // Essential health check endpoint
  console.log('🩺 Setting up health check endpoint...');
  app.get('/health', (req, res) => {
    console.log('🩺 Health check requested');
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '5000',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      message: 'Minimal server is running'
    };
    console.log('📤 Sending health response:', JSON.stringify(response, null, 2));
    res.status(200).json(response);
  });

  // API health check
  app.get('/api/health', (req, res) => {
    console.log('🩺 API health check requested');
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      message: 'Minimal API is operational'
    });
  });

  // Root API endpoint
  app.get('/api', (req, res) => {
    console.log('🏠 Root API requested');
    res.status(200).json({
      message: 'Comida Africana Minimal API',
      version: '1.0.0-minimal',
      status: 'operational',
      timestamp: new Date().toISOString()
    });
  });

  // Root endpoint
  app.get('/', (req, res) => {
    console.log('🏠 Root endpoint requested');
    res.status(200).json({
      message: 'Comida Africana Minimal Server',
      status: 'running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Catch-all 404 handler
  app.use('*', (req, res) => {
    console.log('❓ 404 for path:', req.originalUrl);
    res.status(404).json({
      status: 'error',
      message: 'Endpoint not found',
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('❌ Global error:', err.message);
    console.error('❌ Stack:', err.stack);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  });

  // Server configuration
  const PORT = parseInt(process.env.PORT, 10) || 5000;
  const HOST = '0.0.0.0';

  console.log('🚀 Starting server...');
  console.log('📍 Host:', HOST);
  console.log('🔌 Port:', PORT);

  // Start server with detailed error handling
  const server = app.listen(PORT, HOST, () => {
    console.log('🎉 SERVER STARTED SUCCESSFULLY!');
    console.log('🌐 Server listening on:', HOST + ':' + PORT);
    console.log('🔗 Health check URL: http://' + HOST + ':' + PORT + '/health');
    console.log('🔗 API health URL: http://' + HOST + ':' + PORT + '/api/health');
    console.log('📊 Process ID:', process.pid);
    console.log('💾 Memory usage:', JSON.stringify(process.memoryUsage(), null, 2));
  });

  // Server error handling
  server.on('error', (error) => {
    console.error('❌ SERVER ERROR:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error stack:', error.stack);
    
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

    switch (error.code) {
      case 'EACCES':
        console.error('❌ ' + bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error('❌ ' + bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  });

  // Unhandled promise rejection
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
    console.error('❌ Promise:', promise);
  });

  // Uncaught exception
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  });

  console.log('✅ All startup code executed successfully');

} catch (error) {
  console.error('💥 FATAL STARTUP ERROR:', error.message);
  console.error('💥 Stack:', error.stack);
  console.error('💥 This error prevented server startup');
  process.exit(1);
}