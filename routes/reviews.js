// routes/reviews.js
const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// Route to get all reviews (no authentication required)
router.get('/', reviewsController.getReviews);

// Route to create a new review (no authentication required)
router.post('/', reviewsController.createReview);

module.exports = router;
