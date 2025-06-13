const { connectToDatabase } = require('./shared/mongodb');
const { User, RefreshToken } = require('./shared/models');
const { auth, generateTokens, admin, staff, owner } = require('./shared/auth');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    await connectToDatabase();

    const { httpMethod, path } = event;
    const segments = path.split('/').filter(Boolean);
    const body = event.body ? JSON.parse(event.body) : {};

    // Public routes
    if (httpMethod === 'POST' && path.includes('/register')) {
      // Register new user
      const { email } = body;
      
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User with this email already exists' })
        };
      }
      
      const user = new User(body);
      await user.save();
      
      const { accessToken, refreshToken, refreshTokenExpiry } = await generateTokens(
        user,
        event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown',
        event.headers['user-agent'] || 'unknown'
      );
      
      // Set cookies for production
      const cookieOptions = process.env.NODE_ENV === 'production' ? 
        '; HttpOnly; Secure; SameSite=Strict' : '; HttpOnly';
      
      const accessCookie = `accessToken=${accessToken}; Max-Age=900${cookieOptions}`;
      const refreshCookie = `refreshToken=${refreshToken}; Max-Age=2592000${cookieOptions}`;
      
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
      
      return {
        statusCode: 201,
        headers: {
          ...headers,
          'Set-Cookie': [accessCookie, refreshCookie].join(', ')
        },
        body: JSON.stringify({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          accessToken,
          refreshToken
        })
      };
    }

    if (httpMethod === 'POST' && path.includes('/login')) {
      // Login user
      const { email, password } = body;
      
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !(await user.isValidPassword(password))) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Invalid credentials' })
        };
      }
      
      if (!user.active) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Account has been deactivated' })
        };
      }
      
      const { accessToken, refreshToken, refreshTokenExpiry } = await generateTokens(
        user,
        event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown',
        event.headers['user-agent'] || 'unknown'
      );
      
      const cookieOptions = process.env.NODE_ENV === 'production' ? 
        '; HttpOnly; Secure; SameSite=Strict' : '; HttpOnly';
      
      const accessCookie = `accessToken=${accessToken}; Max-Age=900${cookieOptions}`;
      const refreshCookie = `refreshToken=${refreshToken}; Max-Age=2592000${cookieOptions}`;
      
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': [accessCookie, refreshCookie].join(', ')
        },
        body: JSON.stringify({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          accessToken,
          refreshToken
        })
      };
    }

    if (httpMethod === 'POST' && path.includes('/refresh-token')) {
      // Refresh token
      let refreshToken = body.refreshToken;
      
      if (!refreshToken && event.headers.cookie) {
        const cookies = event.headers.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
        refreshToken = cookies.refreshToken;
      }
      
      if (!refreshToken) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Refresh token required' })
        };
      }
      
      const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
      if (!tokenDoc || tokenDoc.isExpired || tokenDoc.revoked) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Invalid or expired refresh token' })
        };
      }
      
      const user = await User.findById(tokenDoc.userId);
      if (!user || !user.active) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'User not found or inactive' })
        };
      }
      
      // Revoke old token and generate new ones
      tokenDoc.revoked = new Date();
      await tokenDoc.save();
      
      const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
        user,
        event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown',
        event.headers['user-agent'] || 'unknown'
      );
      
      const cookieOptions = process.env.NODE_ENV === 'production' ? 
        '; HttpOnly; Secure; SameSite=Strict' : '; HttpOnly';
      
      const accessCookie = `accessToken=${accessToken}; Max-Age=900${cookieOptions}`;
      const refreshCookie = `refreshToken=${newRefreshToken}; Max-Age=2592000${cookieOptions}`;
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': [accessCookie, refreshCookie].join(', ')
        },
        body: JSON.stringify({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          accessToken,
          refreshToken: newRefreshToken
        })
      };
    }

    if (httpMethod === 'POST' && path.includes('/logout')) {
      // Logout user
      let refreshToken = body.refreshToken;
      
      if (!refreshToken && event.headers.cookie) {
        const cookies = event.headers.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
        refreshToken = cookies.refreshToken;
      }
      
      if (refreshToken) {
        await RefreshToken.findOneAndUpdate(
          { token: refreshToken },
          { revoked: new Date() }
        );
      }
      
      const clearCookies = 'accessToken=; Max-Age=0; refreshToken=; Max-Age=0';
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': clearCookies
        },
        body: JSON.stringify({ success: true, message: 'Logged out successfully' })
      };
    }

    // Protected routes require authentication
    const authResult = await auth(event);
    if (!authResult.success) {
      return {
        statusCode: authResult.statusCode,
        headers,
        body: JSON.stringify({ message: authResult.error })
      };
    }

    const { user, userDocument } = authResult;

    if (httpMethod === 'GET' && path.includes('/profile')) {
      // Get profile
      const userWithOrders = await User.findById(user.id)
        .select('-password')
        .populate({
          path: 'orderHistory',
          options: { sort: { createdAt: -1 }, limit: 5 }
        });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          user: userWithOrders
        })
      };
    }

    if (httpMethod === 'PUT' && path.includes('/profile')) {
      // Update profile
      const restrictedFields = ['password', 'role', 'email', 'emailVerified'];
      restrictedFields.forEach(field => delete body[field]);
      
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        body,
        { new: true, runValidators: true }
      ).select('-password');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          user: updatedUser
        })
      };
    }

    if (httpMethod === 'POST' && path.includes('/address')) {
      // Add address
      const userData = await User.findById(user.id);
      userData.addAddress(body);
      await userData.save();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          addresses: userData.addresses
        })
      };
    }

    if (httpMethod === 'PUT' && path.includes('/change-password')) {
      // Change password
      const { currentPassword, newPassword } = body;
      
      const userData = await User.findById(user.id);
      if (!(await userData.isValidPassword(currentPassword))) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Current password is incorrect' })
        };
      }
      
      userData.password = newPassword;
      await userData.save();
      
      // Revoke all refresh tokens
      await RefreshToken.updateMany(
        { userId: user.id },
        { revoked: new Date() }
      );
      
      const clearCookies = 'accessToken=; Max-Age=0; refreshToken=; Max-Age=0';
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': clearCookies
        },
        body: JSON.stringify({ success: true, message: 'Password changed successfully' })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Users function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};