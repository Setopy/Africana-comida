/**
 * Cache control middleware for static assets and API responses
 */

// Cache control middleware for static assets
const setCache = (options = {}) => {
  return (req, res, next) => {
    // Define default options
    const defaultOptions = {
      noCache: false,
      maxAge: 3600, // 1 hour in seconds
      includePattern: /\.(css|js|jpe?g|png|gif|ico|svg|woff2?)$/i,
      excludePattern: /\/api\//
    };
    
    // Merge with provided options
    const config = { ...defaultOptions, ...options };
    
    // Skip for excluded paths or if explicitly set to no-cache
    if (
      config.noCache ||
      (config.excludePattern && config.excludePattern.test(req.path))
    ) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return next();
    }
    
    // Set caching headers for static assets
    if (config.includePattern && config.includePattern.test(req.path)) {
      // Use strong caching for assets with hashed filenames
      if (req.path.match(/\.[0-9a-f]{8,}\.(js|css|png|jpg|jpeg|gif|svg)$/i)) {
        res.setHeader('Cache-Control', `public, max-age=${config.maxAge * 7}, immutable`);
      } else {
        res.setHeader('Cache-Control', `public, max-age=${config.maxAge}`);
      }
    }
    
    next();
  };
};

// Cache middleware for API responses
const apiCache = (duration) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next();
    
    // Don't cache if authenticated
    if (req.user) {
      res.setHeader('Cache-Control', 'private, no-cache');
      return next();
    }
    
    // Set appropriate headers
    res.setHeader('Cache-Control', `public, max-age=${duration}`);
    next();
  };
};

// Memory cache for API responses (simple implementation)
const memoryCache = () => {
  const cache = new Map();
  const DEFAULT_CACHE_TIME = 60 * 1000; // 1 minute in milliseconds
  
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next();
    
    // Don't cache if authenticated or explicitly disabled
    if (req.user || req.headers['x-no-cache']) return next();
    
    // Create a cache key based on URL and query params
    const cacheKey = `${req.originalUrl || req.url}`;
    
    // Try to get from cache
    const cachedData = cache.get(cacheKey);
    if (cachedData && cachedData.expires > Date.now()) {
      // Return cached response
      return res.status(200).json(cachedData.data);
    }
    
    // Override send to cache the response
    const originalSend = res.json;
    res.json = function(body) {
      // Only cache successful responses
      if (res.statusCode === 200) {
        const cacheTime = parseInt(req.query._cache) || DEFAULT_CACHE_TIME;
        cache.set(cacheKey, {
          data: body,
          expires: Date.now() + cacheTime
        });
      }
      originalSend.call(this, body);
    };
    
    next();
  };
};

module.exports = {
  setCache,
  apiCache,
  memoryCache
};
