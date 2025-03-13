const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { catchAsync, AppError } = require('../utils/errorHandler');
const { logger } = require('../utils/logger');
const { generateTokens } = require('../middleware/auth');
const config = require('../config/config');

/**
 * Register a new user
 * @route POST /api/users/register
 */
exports.register = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }
  
  // Create new user
  const user = new User(req.body);
  await user.save();
  
  // Generate tokens
  const { accessToken, refreshToken, refreshTokenExpiry } = await generateTokens(
    user, 
    req.ip, 
    req.headers['user-agent']
  );
  
  // Set cookies in production
  if (config.NODE_ENV === 'production') {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
  
  // Update last login time
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
  
  // Log the registration
  logger.info('New user registered', { userId: user._id, email: user.email });
  
  res.status(201).json({
    status: 'success',
    message: 'Registration successful',
    token: accessToken,
    refreshToken: config.NODE_ENV !== 'production' ? refreshToken : undefined,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Login user
 * @route POST /api/users/login
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }
  
  // Check if user is active
  if (!user.active) {
    return next(new AppError('This account has been deactivated', 401));
  }
  
  // Check password
  const isMatch = await user.isValidPassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }
  
  // Generate tokens
  const { accessToken, refreshToken, refreshTokenExpiry } = await generateTokens(
    user, 
    req.ip, 
    req.headers['user-agent']
  );
  
  // Set cookies in production
  if (config.NODE_ENV === 'production') {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
  
  // Update last login time
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
  
  // Log the login
  logger.info('User logged in', { userId: user._id, email: user.email });
  
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token: accessToken,
    refreshToken: config.NODE_ENV !== 'production' ? refreshToken : undefined,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Refresh token
 * @route POST /api/users/refresh-token
 */
exports.refreshToken = catchAsync(async (req, res, next) => {
  // Get refresh token from cookies or request body
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  
  if (!token) {
    return next(new AppError('Refresh token required', 401));
  }
  
  // Find the token in the database
  const refreshTokenDoc = await RefreshToken.findOne({ 
    token, 
    expires: { $gt: new Date() },
    revoked: false
  });
  
  if (!refreshTokenDoc) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }
  
  // Find the user
  const user = await User.findById(refreshTokenDoc.user).select('-password');
  if (!user) {
    return next(new AppError('User not found', 401));
  }
  
  // Check if user is active
  if (!user.active) {
    return next(new AppError('This account has been deactivated', 401));
  }
  
  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken, refreshTokenExpiry } = await generateTokens(
    user,
    req.ip,
    req.headers['user-agent']
  );
  
  // Revoke the old refresh token
  refreshTokenDoc.revoked = true;
  refreshTokenDoc.revokedAt = new Date();
  refreshTokenDoc.revokedReason = 'Token refresh';
  await refreshTokenDoc.save();
  
  // Set cookies in production
  if (config.NODE_ENV === 'production') {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Token refreshed',
    token: accessToken,
    refreshToken: config.NODE_ENV !== 'production' ? newRefreshToken : undefined,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Logout user
 * @route POST /api/users/logout
 */
exports.logout = catchAsync(async (req, res, next) => {
  // Get refresh token from cookies or request body
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  
  if (token) {
    // Revoke the refresh token
    const refreshTokenDoc = await RefreshToken.findOne({ token });
    if (refreshTokenDoc) {
      refreshTokenDoc.revoked = true;
      refreshTokenDoc.revokedAt = new Date();
      refreshTokenDoc.revokedReason = 'User logout';
      await refreshTokenDoc.save();
      
      // Log the logout
      logger.info('User logged out', { userId: refreshTokenDoc.user });
    }
  }
  
  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  res.status(200).json({
    status: 'success',
    message: 'Logout successful'
  });
});

/**
 * Get current user profile
 * @route GET /api/users/profile
 */
exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .select('-password -__v')
    .populate({
      path: 'orderHistory',
      select: 'status totalAmount createdAt items',
      options: { sort: { createdAt: -1 }, limit: 5 }
    });
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: user
  });
});

/**
 * Update user profile
 * @route PUT /api/users/profile
 */
exports.updateProfile = catchAsync(async (req, res, next) => {
  // Don't allow password update through this route
  const { password, role, email, ...updateData } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: user
  });
});

/**
 * Add a new address
 * @route POST /api/users/address
 */
exports.addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Add the address using the model method
  user.addAddress(req.body);
  await user.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Address added successfully',
    data: user.addresses
  });
});

/**
 * Update an address
 * @route PUT /api/users/address/:addressId
 */
exports.updateAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  const addressIndex = user.addresses.findIndex(
    addr => addr._id.toString() === addressId
  );
  
  if (addressIndex === -1) {
    return next(new AppError('Address not found', 404));
  }
  
  // If setting this as default, unset any existing default
  if (req.body.isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // Update address fields
  Object.keys(req.body).forEach(key => {
    user.addresses[addressIndex][key] = req.body[key];
  });
  
  await user.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Address updated successfully',
    data: user.addresses
  });
});

/**
 * Delete an address
 * @route DELETE /api/users/address/:addressId
 */
exports.deleteAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  const addressIndex = user.addresses.findIndex(
    addr => addr._id.toString() === addressId
  );
  
  if (addressIndex === -1) {
    return next(new AppError('Address not found', 404));
  }
  
  // If removing default address, set a new default if other addresses exist
  const wasDefault = user.addresses[addressIndex].isDefault;
  
  // Remove the address
  user.addresses.splice(addressIndex, 1);
  
  // If we removed the default address and there are other addresses, set a new default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }
  
  await user.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Address deleted successfully',
    data: user.addresses
  });
});

/**
 * Change password
 * @route PUT /api/users/change-password
 */
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  // Find user with password
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Check current password
  const isMatch = await user.isValidPassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 401));
  }
  
  // Update password
  user.password = newPassword;
  await user.save();
  
  // Revoke all refresh tokens for this user
  await RefreshToken.revokeTokensForUser(user._id, 'Password change');
  
  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  // Log the password change
  logger.info('User changed password', { userId: user._id });
  
  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully. Please log in again.'
  });
});

/**
 * Deactivate account
 * @route PUT /api/users/deactivate
 */
exports.deactivateAccount = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    { new: true }
  );
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Revoke all refresh tokens for this user
  await RefreshToken.revokeTokensForUser(user._id, 'Account deactivation');
  
  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  // Log the deactivation
  logger.info('User deactivated account', { userId: user._id });
  
  res.status(200).json({
    status: 'success',
    message: 'Account deactivated successfully'
  });
});