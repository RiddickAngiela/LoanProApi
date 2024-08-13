const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController'); // Ensure this path is correct
const { auth, admin } = require('../middleware/auth');

// Route to get all reviews
router.get('/', reviewsController.getReviews); // Ensure getReviews is defined and imported correctly

// Route to create a new review
router.post('/', reviewsController.createReview);

// Admin route to delete a review
router.delete('/:id', auth, admin, reviewsController.deleteReview);

module.exports = router;
