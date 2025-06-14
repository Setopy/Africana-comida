const mongoose = require('mongoose');

let cachedConnection = null;

const connectToDatabase = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    // Load environment variables if not already loaded
    if (!process.env.MONGODB_URI) {
      require('dotenv').config();
    }

    // Debug logging
    console.log('MongoDB connection attempt:', {
      hasURI: !!process.env.MONGODB_URI,
      connectionState: mongoose.connection.readyState
    });

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
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