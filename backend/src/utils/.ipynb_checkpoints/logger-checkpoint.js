const winston = require('winston');
const path = require('path');
const config = require('../config/config');

// Define log formats
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Define log directory
const logDir = config.LOG_DIR;

// Create logger
const logger = winston.createLogger({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'comida-africana-api' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat
    })
  ]
});

// Add file transports in production
if (config.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
  
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// HTTP request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    
    // Skip logging health check endpoints in production
    if (config.NODE_ENV === 'production' && req.path === '/api/health') {
      return;
    }
    
    if (res.statusCode >= 400) {
      logger.warn(`${req.method} ${req.originalUrl || req.url}`, {
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        responseTime,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
    } else {
      logger.info(`${req.method} ${req.originalUrl || req.url}`, {
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        responseTime
      });
    }
  });
  
  next();
};

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests (over 1000ms)
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.originalUrl || req.url,
        duration,
        status: res.statusCode,
        path: req.path
      });
    }
  });
  
  next();
};

module.exports = {
  logger,
  requestLogger,
  performanceMonitor
};