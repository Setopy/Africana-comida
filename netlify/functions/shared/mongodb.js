const mongoose = require('mongoose');

let cachedConnection = null;

const connectToDatabase = async () => {
  // Return cached connection if available and connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    // Netlify automatically provides environment variables, but try dotenv as fallback
    if (!process.env.MONGODB_URI) {
      try {
        require('dotenv').config();
      } catch (e) {
        console.log('dotenv not available, using Netlify environment variables');
      }
    }

    console.log('MongoDB connection attempt:', {
      hasURI: !!process.env.MONGODB_URI,
      uriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      connectionState: mongoose.connection.readyState,
      nodeEnv: process.env.NODE_ENV
    });

    if (!process.env.MONGODB_URI) {
      const error = new Error('MONGODB_URI environment variable is not set');
      console.error('Environment variables available:', Object.keys(process.env).filter(key => 
        key.startsWith('MONGODB') || key.startsWith('JWT') || key.startsWith('NODE')
      ));
      throw error;
    }

    // Close any existing connection that might be in a bad state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 5,
      retryWrites: true,
      retryReads: true,
      bufferCommands: false,
      bufferMaxEntries: 0
    });

    cachedConnection = connection;
    console.log('✅ Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

module.exports = { connectToDatabase };