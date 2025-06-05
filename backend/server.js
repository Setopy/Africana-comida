const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint (important for Render)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Africana Comida API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// Routes
app.use('/api/menu', require('./src/routes/menuRoutes'));

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Don't exit in production, let Render retry
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Server startup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'localhost'}`);
  console.log(`📡 Server accessible at: http://0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
