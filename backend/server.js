const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./src/config/config');
const { logger, requestLogger, performanceMonitor } = require('./src/utils/logger');

// Import routes
const menuRoutes = require('./src/routes/menuRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const userRoutes = require('./src/routes/userRoutes');

// Initialize express app
const app = express();

// Request logging
app.use(requestLogger);
app.use(performanceMonitor);

// Security middleware with specific configurations
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

// Setup CORS
app.use(cors({
  origin: config.CORS_ORIGIN !== '*' ? config.CORS_ORIGIN.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse cookies
app.use(cookieParser());

// Enable compression
app.use(compression());

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with proper error handling and reconnect strategy
mongoose.connect(config.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => {
  logger.error('Failed to connect to MongoDB', { error: err.message });
  process.exit(1); // Exit if database connection fails
});

// Handle MongoDB connection issues
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', { error: err.message });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
  mongoose.connect(config.MONGODB_URI);
});

// Import the cache middleware
const { setCache } = require('./src/middleware/cache');

// Apply caching to static assets
app.use(setCache());

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// API health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Root API route
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Comida Africana API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// For client-side routing - serve index.html for all routes not handled by API
if (config.NODE_ENV === 'production') {
  // Serve frontend static assets with cache headers
  app.use(
    express.static(path.join(__dirname, '../frontend/dist'), {
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          // No cache for HTML files
          res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
          // Cache for 1 week for static assets (using immutable if they have hash in filename)
          if (filePath.match(/\.[0-9a-f]{8}\.(js|css)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
          }
        }
      }
    })
  );
  
  // Serve index.html for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Import error handler
const { handleError } = require('./src/utils/errorHandler');

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  handleError(err, req, res, next);
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});