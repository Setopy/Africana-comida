const cache = new Map();

const apiCache = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < duration * 1000) {
      return res.json(cached.data);
    }
    
    const originalSend = res.json;
    res.json = function(data) {
      cache.set(key, { data, timestamp: Date.now() });
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = { apiCache };
