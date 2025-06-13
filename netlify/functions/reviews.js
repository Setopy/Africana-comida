const { connectToDatabase } = require('./shared/mongodb');
const { Review, MenuItem } = require('./shared/models');
const { auth, admin } = require('./shared/auth');

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

    const { httpMethod, path, queryStringParameters } = event;
    const segments = path.split('/').filter(Boolean);
    const reviewId = segments[segments.length - 1];
    const body = event.body ? JSON.parse(event.body) : {};

    // Parse query parameters
    const query = queryStringParameters || {};
    const { sort = '-createdAt', limit = 20, page = 1 } = query;

    switch (httpMethod) {
      case 'POST':
        if (path.includes('/reviews') && !path.includes('/admin') && !reviewId) {
          // Create new review (public route)
          const { menuItem } = body;
          
          // Check if menu item exists when provided
          if (menuItem) {
            const item = await MenuItem.findById(menuItem);
            if (!item) {
              return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Menu item not found' })
              };
            }
          }
          
          const review = new Review(body);
          const savedReview = await review.save();
          
          return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
              status: 'success',
              message: 'Thank you for your review! It will be visible after approval.',
              data: savedReview
            })
          };
        }
        break;

      case 'GET':
        if (path.includes('/admin')) {
          // Admin route - get all reviews including unapproved
          const authResult = await auth(event);
          if (!authResult.success) {
            return {
              statusCode: authResult.statusCode,
              headers,
              body: JSON.stringify({ message: authResult.error })
            };
          }

          const adminCheck = admin(authResult.user);
          if (!adminCheck.success) {
            return {
              statusCode: adminCheck.statusCode,
              headers,
              body: JSON.stringify({ message: adminCheck.error })
            };
          }

          // Build admin query
          const adminQuery = {};
          const { approved, menuItem, minRating, maxRating } = query;
          
          if (approved !== undefined) {
            adminQuery.approved = approved === 'true';
          }
          
          if (menuItem) {
            adminQuery.menuItem = menuItem;
          }
          
          if (minRating !== undefined || maxRating !== undefined) {
            adminQuery.rating = {};
            if (minRating !== undefined) adminQuery.rating.$gte = parseInt(minRating);
            if (maxRating !== undefined) adminQuery.rating.$lte = parseInt(maxRating);
          }
          
          const skip = (parseInt(page) - 1) * parseInt(limit);
          
          const reviews = await Review.find(adminQuery)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate({
              path: 'menuItem',
              select: 'name category'
            });
          
          const total = await Review.countDocuments(adminQuery);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              status: 'success',
              results: reviews.length,
              pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
              },
              data: reviews
            })
          };
        } else if (path.includes('/menu-item/')) {
          // Get reviews for specific menu item
          const menuItemId = segments[segments.indexOf('menu-item') + 1];
          
          // Check if menu item exists
          const menuItem = await MenuItem.findById(menuItemId);
          if (!menuItem) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'Menu item not found' })
            };
          }
          
          const reviewQuery = { 
            menuItem: menuItemId,
            approved: true 
          };
          
          const skip = (parseInt(page) - 1) * parseInt(limit);
          
          const reviews = await Review.find(reviewQuery)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));
          
          const total = await Review.countDocuments(reviewQuery);
          
          // Get rating statistics using aggregation
          const statsResult = await Review.aggregate([
            { $match: { menuItem: menuItem._id, approved: true } },
            { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
          ]);
          
          const distributionResult = await Review.aggregate([
            { $match: { menuItem: menuItem._id, approved: true } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
          ]);
          
          const stats = statsResult.length > 0 ? statsResult[0] : { avgRating: 0, count: 0 };
          const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          distributionResult.forEach(item => {
            distribution[item._id] = item.count;
          });
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
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
            })
          };
        } else if (path.includes('/stats')) {
          // Get review statistics
          const statsResult = await Review.aggregate([
            { $match: { approved: true } },
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
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              status: 'success',
              data: statsResult.length > 0 ? statsResult[0] : {
                avgRating: 0,
                count: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
              }
            })
          };
        } else {
          // Get all approved reviews (public route)
          const reviewQuery = { approved: true };
          const skip = (parseInt(page) - 1) * parseInt(limit);
          
          const reviews = await Review.find(reviewQuery)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate({
              path: 'menuItem',
              select: 'name category'
            });
          
          const total = await Review.countDocuments(reviewQuery);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              status: 'success',
              results: reviews.length,
              pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
              },
              data: reviews
            })
          };
        }
        break;

      case 'PUT':
        // Admin routes requiring authentication
        const authResult = await auth(event);
        if (!authResult.success) {
          return {
            statusCode: authResult.statusCode,
            headers,
            body: JSON.stringify({ message: authResult.error })
          };
        }

        const adminCheck = admin(authResult.user);
        if (!adminCheck.success) {
          return {
            statusCode: adminCheck.statusCode,
            headers,
            body: JSON.stringify({ message: adminCheck.error })
          };
        }

        if (path.includes('/approve')) {
          // Approve review
          const approveReviewId = segments[segments.length - 2];
          const review = await Review.findByIdAndUpdate(
            approveReviewId,
            { approved: true },
            { new: true }
          );
          
          if (!review) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'Review not found' })
            };
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              status: 'success',
              message: 'Review approved successfully',
              data: review
            })
          };
        }
        break;

      case 'DELETE':
        // Admin delete review
        const deleteAuthResult = await auth(event);
        if (!deleteAuthResult.success) {
          return {
            statusCode: deleteAuthResult.statusCode,
            headers,
            body: JSON.stringify({ message: deleteAuthResult.error })
          };
        }

        const deleteAdminCheck = admin(deleteAuthResult.user);
        if (!deleteAdminCheck.success) {
          return {
            statusCode: deleteAdminCheck.statusCode,
            headers,
            body: JSON.stringify({ message: deleteAdminCheck.error })
          };
        }

        const review = await Review.findByIdAndDelete(reviewId);
        
        if (!review) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Review not found' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            status: 'success',
            message: 'Review deleted successfully'
          })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Reviews function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};