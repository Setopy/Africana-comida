const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, admin } = require('../middleware/auth');

// Public routes
router.get('/', reviewController.getAllReviews);
router.get('/menu-item/:menuItemId', 
reviewController.getReviewsByMenuItem);
router.post('/', reviewController.createReview);

// Admin routes
router.get('/admin', auth, admin, reviewController.getAllReviewsAdmin);
router.put('/:id/approve', auth, admin, reviewController.approveReview);
router.delete('/:id', auth, admin, reviewController.deleteReview);

module.exports = router;
