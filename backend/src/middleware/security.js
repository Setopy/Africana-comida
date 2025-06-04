const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { AppError } = require('../utils/errorHandler');
const { logger } = require('../utils/logger');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent')
      });
      
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const rateLimiters = {
  // General API rate limiting
  general: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again later.'
  ),
  
  // Authentication rate limiting (stricter)
  auth: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 auth attempts per windowMs
    'Too many authentication attempts, please try again later.',
    true // don't count successful requests
  ),
  
  // Password reset rate limiting
  passwordReset: createRateLimit(
    60 * 60 * 1000, // 1 hour
    3, // limit each IP to 3 password reset attempts per hour
    'Too many password reset attempts, please try again later.'
  ),
  
  // Order creation rate limiting
  orderCreation: createRateLimit(
    5 * 60 * 1000, // 5 minutes
    10, // limit each IP to 10 orders per 5 minutes
    'Too many orders created, please try again later.'
  ),
  
  // Review creation rate limiting
  reviewCreation: createRateLimit(
    60 * 60 * 1000, // 1 hour
    5, // limit each IP to 5 reviews per hour
    'Too many reviews submitted, please try again later.'
  )
};

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Consider removing in production
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      connectSrc: [
        "'self'",
        process.env.NODE_ENV === 'development' ? "http://localhost:3000" : ""
      ].filter(Boolean),
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      manifestSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Disable for better compatibility
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
});

// IP whitelist middleware (for admin functions)
const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Allow localhost in development
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    
    if (allowedIPs.length === 0 || allowedIPs.includes(clientIP)) {
      return next();
    }
    
    logger.warn(`Unauthorized IP access attempt: ${clientIP}`, {
      ip: clientIP,
      path: req.path,
      userAgent: req.get('User-Agent')
    });
    
    return next(new AppError('Access denied from this IP address', 403));
  };
};

// Request size limiter
const requestSizeLimiter = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length')) || 0;
    const maxSizeBytes = parseInt(maxSize) * 1024 * 1024; // Convert MB to bytes
    
    if (contentLength > maxSizeBytes) {
      return next(new AppError('Request payload too large', 413));
    }
    
    next();
  };
};

// Suspicious activity detector
const suspiciousActivityDetector = () => {
  const suspiciousPatterns = [
    /\b(union|select|insert|delete|drop|create|alter|exec|execute)\b/i,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/i,
    /on\w+\s*=/i
  ];
  
  return (req, res, next) => {
    const checkData = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params);
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(checkData)) {
        logger.warn(`Suspicious activity detected from IP: ${req.ip}`, {
          ip: req.ip,
          path: req.path,
          userAgent: req.get('User-Agent'),
          suspiciousData: checkData.substring(0, 500) // Log first 500 chars
        });
        
        return next(new AppError('Suspicious activity detected', 400));
      }
    }
    
    next();
  };
};

// API key validation (for external integrations)
const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return next(new AppError('Invalid or missing API key', 401));
  }
  
  next();
};

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

module.exports = {
  rateLimiters,
  securityHeaders,
  ipWhitelist,
  requestSizeLimiter,
  suspiciousActivityDetector,
  validateApiKey,
  corsOptions
};