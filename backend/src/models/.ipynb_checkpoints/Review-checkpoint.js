const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5, index: true },
  comment: { type: String, required: true },
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', index: true },
  approved: { type: Boolean, default: false, index: true },
  reply: { type: String },
  repliedAt: { type: Date },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  flagged: { type: Boolean, default: false },
  flagReason: { type: String }
}, { timestamps: true });

// Add compound indexes
reviewSchema.index({ menuItem: 1, approved: 1 });
reviewSchema.index({ createdAt: -1 }); // For sorting by date descending
reviewSchema.index({ rating: 1, approved: 1 }); // For filtering by rating
reviewSchema.index({ approved: 1, createdAt: -1 }); // For displaying approved reviews by recency

// Add static method to get average rating for a menu item
reviewSchema.statics.getAverageRating = async function(menuItemId) {
  const result = await this.aggregate([
    { $match: { menuItem: menuItemId, approved: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  return result.length > 0 ? { avgRating: result[0].avgRating, count: result[0].count } : { avgRating: 0, count: 0 };
};

// Add static method to get distribution of ratings
reviewSchema.statics.getRatingDistribution = async function(menuItemId) {
  const result = await this.aggregate([
    { $match: { menuItem: menuItemId, approved: true } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);
  
  // Format into an object with ratings 1-5
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  result.forEach(item => {
    distribution[item._id] = item.count;
  });
  
  return distribution;
};

// Pre-save hook for validation
reviewSchema.pre('save', function(next) {
  // Sanitize user input
  this.name = this.name.trim();
  this.email = this.email.trim().toLowerCase();
  this.comment = this.comment.trim();
  
  next();
});

module.exports = mongoose.model('Review', reviewSchema);