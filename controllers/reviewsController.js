// controllers/reviewsController.js
const { Review } = require('../models');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { username, image, review, rating } = req.body;

    // Validate input
    if (!username || !review || rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newReview = await Review.create({
      username,
      image: image || null, // If no image provided, set as null
      review,
      rating,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
