const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./src/config/config');
const { logger, requestLogger, performanceMonitor } = require('./src/utils/logger');

// Initialize express app
const app = express();

// Graceful shutdown handler
let server;
let mongoConnection;

const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      
      if (mongoConnection) {
        mongoose.connection.close(false, () => {
          logger.info('MongoDB connection closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Request logging
app.use(requestLogger);
app.use(performanceMonitor);

// Security middleware with Render-optimized configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://via.placeholder.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", config.FRONTEND_URL],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: {
    maxAge: 15552000,
    includeSubDomains: true,
    preload: true
  }
}));

// Setup CORS with Render optimization
app.use(cors({
  origin: config.CORS_ORIGIN !== '*' ? config.CORS_ORIGIN.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // Cache preflight for 24 hours
}));

// Parse cookies and enable compression
app.use(cookieParser());
app.use(compression());

// Parse JSON and URL-encoded data with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import the cache middleware
const { setCache } = require('./src/middleware/cache');
app.use(setCache());

// Health check endpoints (MUST be before auth middleware)
app.get('/health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  // Return 503 if database is not connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      ...healthStatus,
      status: 'unhealthy',
      error: 'Database not connected'
    });
  }
  
  res.status(200).json(healthStatus);
});

// Render-specific health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root API route
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Comida Africana API',
    version: '1.0.0',
    status: 'operational',
    documentation: '/api/docs'
  });
});

// MongoDB connection with retry logic and non-blocking startup
const connectToMongoDB = async () => {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      logger.info(`Attempting to connect to MongoDB (attempt ${retries + 1}/${maxRetries})`);
      
      mongoConnection = await mongoose.connect(config.MONGODB_URI, {
        serverSelectionTimeoutMS: 15000, // Increased for Render
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
        heartbeatFrequencyMS: 10000,
        maxPoolSize: 10,
        retryWrites: true,
        retryReads: true
      });
      
      logger.info('✅ Connected to MongoDB successfully');
      break;
      
    } catch (error) {
      retries++;
      logger.error(`❌ MongoDB connection attempt ${retries} failed:`, {
        error: error.message,
        retryIn: Math.pow(2, retries) * 1000
      });
      
      if (retries >= maxRetries) {
        logger.error('❌ Max MongoDB connection retries reached. Starting server anyway...');
        break;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  logger.error('❌ MongoDB connection error:', { error: err.message });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected. Will attempt to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ MongoDB reconnected successfully');
});

// Import routes
const menuRoutes = require('./src/routes/menuRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const userRoutes = require('./src/routes/userRoutes');

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Serve static files in production
if (config.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  
  // Serve frontend static assets with optimized cache headers
  app.use(
    express.static(frontendPath, {
      etag: true,
      lastModified: true,
      maxAge: '1y', // Cache static assets for 1 year
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
          if (filePath.match(/\.[0-9a-f]{8,}\.(js|css)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=86400');
          }
        }
      }
    })
  );
  
  // Serve index.html for client-side routing
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'API endpoint not found' 
      });
    }
    
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        logger.error('Error serving index.html:', { error: err.message });
        res.status(500).json({ 
          status: 'error', 
          message: 'Unable to serve application' 
        });
      }
    });
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `API route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Import error handler
const { handleError } = require('./src/utils/errorHandler');

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error(`❌ Global error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  handleError(err, req, res, next);
});

// Start server function
const startServer = async () => {
  const PORT = config.PORT;
  const HOST = '0.0.0.0'; // Essential for Render deployment
  
  try {
    // Start MongoDB connection (non-blocking)
    connectToMongoDB().catch(error => {
      logger.error('❌ Initial MongoDB connection failed:', { error: error.message });
    });
    
    // Start HTTP server
    server = app.listen(PORT, HOST, () => {
      logger.info(`🚀 Server running in ${config.NODE_ENV} mode`);
      logger.info(`🌐 Server listening on ${HOST}:${PORT}`);
      logger.info(`🔗 Health check available at: http://${HOST}:${PORT}/health`);
      
      if (config.NODE_ENV === 'production') {
        logger.info('🏭 Production mode: Serving static files');
      }
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      
      const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
      
      switch (error.code) {
        case 'EACCES':
          logger.error(`❌ ${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`❌ ${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
    
  } catch (error) {
    logger.error('❌ Failed to start server:', { error: error.message });
    process.exit(1);
  }
};

// Start the server
startServer();