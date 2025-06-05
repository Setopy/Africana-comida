// ULTRA-SAFE SERVER FOR RENDER DEPLOYMENT
// This version handles all potential failure points gracefully

console.log('🔥 ULTRA-SAFE SERVER STARTING...');
console.log('📅 Timestamp:', new Date().toISOString());

// Wrap everything in try-catch
try {
  // Load dotenv safely
  try {
    require('dotenv').config();
    console.log('✅ dotenv loaded');
  } catch (envError) {
    console.log('⚠️ dotenv not loaded:', envError.message);
  }

  console.log('🌍 Environment Variables:');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'NOT_SET');
  console.log('- PORT:', process.env.PORT || 'NOT_SET');
  console.log('- MONGODB_URI present:', !!process.env.MONGODB_URI);
  console.log('- JWT_SECRET present:', !!process.env.JWT_SECRET);

  // Express setup
  const express = require('express');
  const app = express();

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });

  // Health check (primary)
  app.get('/health', (req, res) => {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      port: process.env.PORT || 'default',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      envVars: {
        NODE_ENV: !!process.env.NODE_ENV,
        PORT: !!process.env.PORT,
        MONGODB_URI: !!process.env.MONGODB_URI,
        JWT_SECRET: !!process.env.JWT_SECRET
      }
    };
    
    console.log('🩺 Health check response:', JSON.stringify(healthData, null, 2));
    res.status(200).json(healthData);
  });

  // API endpoints
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'comida-africana-api',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api', (req, res) => {
    res.json({
      message: 'Comida Africana API - Safe Mode',
      version: '1.0.0-safe',
      status: 'operational'
    });
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'Comida Africana Server - Safe Mode',
      status: 'running',
      timestamp: new Date().toISOString()
    });
  });

  // Catch all
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not found',
      path: req.originalUrl
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  });

  // Server startup
  const PORT = parseInt(process.env.PORT) || 5000;
  const HOST = '0.0.0.0';

  console.log('🚀 Starting server on', HOST + ':' + PORT);

  const server = app.listen(PORT, HOST, () => {
    console.log('🎉 SERVER RUNNING SUCCESSFULLY!');
    console.log('🌐 Listening on:', HOST + ':' + PORT);
    console.log('🔗 Health: http://' + HOST + ':' + PORT + '/health');
    console.log('🔗 API: http://' + HOST + ':' + PORT + '/api');
  });

  server.on('error', (error) => {
    console.error('❌ Server error:', error.message);
    process.exit(1);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log('🛑 Shutdown signal received:', signal);
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

} catch (error) {
  console.error('💥 STARTUP FAILED:', error.message);
  console.error('💥 Stack:', error.stack);
  process.exit(1);
}