const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define and validate configuration
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_DIR: process.env.LOG_DIR || path.join(__dirname, '../../logs')
};

// Validate required configuration
const requiredEnvs = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvs = requiredEnvs.filter(env => !config[env]);

if (missingEnvs.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
}

// Create the logs directory if it doesn't exist in production
if (config.NODE_ENV === 'production') {
  const fs = require('fs');
  if (!fs.existsSync(config.LOG_DIR)) {
    fs.mkdirSync(config.LOG_DIR, { recursive: true });
  }
}

module.exports = config;