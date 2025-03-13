const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');
const { catchAsync, AppError } = require('../utils/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Create a new review
 * @route POST /api/reviews
 */
exports.createReview = catchAsync(async (req, res, next) => {
  const { menuItem } = req.body;
  
  // Check if menu item exists when provided
  if (menuItem) {
    const item = await MenuItem.findById(menuItem);
    if (!item) {
      return next(new AppError('Menu item not found', 404));
    }
  }
  
  // Create and save the review
  const review = new Review(req.body);
  const savedReview = await review.save();
  
  // Log the review creation
  logger.info('New review created', { reviewId: savedReview._id, menuItem });
  
  res.status(201).json({
    status: 'success',
    message: 'Thank you for your review! It will be visible after approval.',
    data: savedReview
  });
});

/**
 * Get all approved reviews
 * @route GET /api/reviews
 */
exports.getAllReviews = catchAsync(async (req, res, next) => {
  // Get query parameters
  const { sort = '-createdAt', limit = 20, page = 1 } = req.query;
  
  // Build query
  const query = { approved: true };
  
  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const reviews = await Review.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate({
      path: 'menuItem',
      select: 'name category'
    });
  
  // Get total count for pagination
  const total = await Review.countDocuments(query);
  
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit)
    },
    data: reviews
  });
});

/**
 * Get reviews for a specific menu item
 * @route GET /api/reviews/menu-item/:menuItemId
 */
exports.getReviewsByMenuItem = catchAsync(async (req, res, next) => {
  const { menuItemId } = req.params;
  const { sort = '-createdAt', limit = 10, page = 1 } = req.query;
  
  // Check if menu item exists
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    return next(new AppError('Menu item not found', 404));
  }
  
  // Build query
  const query = { 
    menuItem: menuItemId,
    approved: true 
  };
  
  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const reviews = await Review.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));
  
  // Get total count for pagination
  const total = await Review.countDocuments(query);
  
  // Get rating statistics
  const stats = await Review.getAverageRating(menuItemId);
  const distribution = await Review.getRatingDistribution(menuItemId);
  
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit)
    },
    stats: {
      averageRating: stats.avgRating,
      reviewCount: stats.count,
      distribution
    },
    data: reviews
  });
});

/**
 * Admin: Get all reviews including unapproved
 * @route GET /api/reviews/admin
 */
exports.getAllReviewsAdmin = catchAsync(async (req, res, next) => {
  // Get query parameters
  const { 
    sort = '-createdAt', 
    limit = 20, 
    page = 1, 
    approved, 
    menuItem,
    minRating,
    maxRating
  } = req.query;
  
  // Build query
  const query = {};
  
  // Filter by approval status if specified
  if (approved !== undefined) {
    query.approved = approved === 'true';
  }
  
  // Filter by menu item if specified
  if (menuItem) {
    query.menuItem = menuItem;
  }
  
  // Filter by rating range if specified
  if (minRating !== undefined || maxRating !== undefined) {
    query.rating = {};
    if (minRating !== undefined) query.rating.$gte = parseInt(minRating);
    if (maxRating !== undefined) query.rating.$lte = parseInt(maxRating);
  }
  
  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const reviews = await Review.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate({
      path: 'menuItem',
      select: 'name category'
    });
  
  // Get total count for pagination
  const total = await Review.countDocuments(query);
  
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit)
    },
    data: reviews
  });
});

/**
 * Admin: Approve a review
 * @route PUT /api/reviews/:id/approve
 */
exports.approveReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );
  
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  
  // Log the approval
  logger.info('Review approved', { reviewId: review._id, adminId: req.user.id });
  
  res.status(200).json({
    status: 'success',
    message: 'Review approved successfully',
    data: review
  });
});

/**
 * Admin: Delete a review
 * @route DELETE /api/reviews/:id
 */
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  
  // Log the deletion
  logger.info('Review deleted', { reviewId: review._id, adminId: req.user.id });
  
  res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully'
  });
});

/**
 * Admin: Reply to a review
 * @route PUT /api/reviews/:id/reply
 */
exports.replyToReview = catchAsync(async (req, res, next) => {
  const { reply } = req.body;
  
  if (!reply || reply.trim() === '') {
    return next(new AppError('Reply content is required', 400));
  }
  
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { 
      reply: reply.trim(),
      repliedAt: new Date(),
      repliedBy: req.user.id
    },
    { new: true }
  );
  
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  
  // Log the reply
  logger.info('Replied to review', { reviewId: review._id, adminId: req.user.id });
  
  res.status(200).json({
    status: 'success',
    message: 'Reply added successfully',
    data: review
  });
});

/**
 * Admin: Flag a review as inappropriate
 * @route PUT /api/reviews/:id/flag
 */
exports.flagReview = catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { 
      flagged: true,
      flagReason: reason || 'Flagged by admin'
    },
    { new: true }
  );
  
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  
  // Log the flag
  logger.info('Review flagged', { 
    reviewId: review._id, 
    adminId: req.user.id,
    reason: reason || 'Flagged by admin'
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Review flagged successfully',
    data: review
  });
});

/**
 * Get review statistics
 * @route GET /api/reviews/stats
 */
exports.getReviewStats = catchAsync(async (req, res, next) => {
  // Only count approved reviews
  const query = { approved: true };
  
  const stats = await Review.aggregate([
    { $match: query },
    { 
      $group: { 
        _id: null, 
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
        rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } }
      } 
    },
    {
      $project: {
        _id: 0,
        avgRating: { $round: ['$avgRating', 2] },
        count: 1,
        distribution: {
          1: '$rating1',
          2: '$rating2',
          3: '$rating3',
          4: '$rating4',
          5: '$rating5'
        }
      }
    }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: stats.length > 0 ? stats[0] : {
      avgRating: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  });
});