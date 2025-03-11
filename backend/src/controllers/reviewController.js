const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { menuItem } = req.body;
    
    // Check if menu item exists
    if (menuItem) {
      const item = await MenuItem.findById(menuItem);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
    }
    
    const review = new Review(req.body);
    const savedReview = await review.save();
    
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all approved reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a specific menu item
exports.getReviewsByMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const reviews = await Review.find({ 
      menuItem: menuItemId,
      approved: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all reviews including unapproved
exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Approve a review
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
