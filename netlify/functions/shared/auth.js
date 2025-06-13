const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, RefreshToken } = require('./models');

const auth = async (event) => {
  try {
    // Load environment variables if not already loaded
    if (!process.env.JWT_SECRET) {
      require('dotenv').config();
    }

    // Check for token in Authorization header or cookies
    let token = event.headers.authorization?.replace('Bearer ', '');
    
    // If no Authorization header, check cookies
    if (!token && event.headers.cookie) {
      const cookies = event.headers.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.accessToken;
    }
    
    if (!token) {
      return { success: false, error: 'Authentication required', statusCode: 401 };
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return { success: false, error: 'User not found', statusCode: 401 };
    }
    
    // Check if user is active
    if (!user.active) {
      return { success: false, error: 'User account has been deactivated', statusCode: 401 };
    }
    
    return { success: true, user: decoded, userDocument: user };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { success: false, error: 'Token expired', statusCode: 401, expired: true };
    } else if (error.name === 'JsonWebTokenError') {
      return { success: false, error: 'Invalid token', statusCode: 401 };
    } else {
      console.error('Auth error:', error.message);
      return { success: false, error: 'Authentication failed', statusCode: 401 };
    }
  }
};

const generateTokens = async (user, ipAddress, userAgent) => {
  try {
    // Load environment variables if not already loaded
    if (!process.env.JWT_SECRET) {
      require('dotenv').config();
    }

    // Generate access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
    );
    
    // Generate refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30); // 30 days
    
    // Save refresh token to database
    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      expires: refreshTokenExpiry,
      createdByIp: ipAddress,
      userAgent: userAgent
    });
    
    await refreshTokenDoc.save();
    
    return {
      accessToken,
      refreshToken,
      refreshTokenExpiry
    };
  } catch (error) {
    console.error('Generate tokens error:', error);
    throw error;
  }
};

const admin = (user) => {
  if (user.role !== 'admin') {
    return { success: false, error: 'Admin access denied', statusCode: 403 };
  }
  return { success: true };
};

const staff = (user) => {
  if (user.role !== 'admin' && user.role !== 'staff') {
    return { success: false, error: 'Staff access denied', statusCode: 403 };
  }
  return { success: true };
};

const owner = (user, resourceId) => {
  if (user.role === 'admin' || user.id === resourceId) {
    return { success: true };
  }
  return { success: false, error: 'Access denied: You can only modify your own resources', statusCode: 403 };
};

module.exports = {
  auth,
  generateTokens,
  admin,
  staff,
  owner
};