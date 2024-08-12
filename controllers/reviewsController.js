// controllers/reviewsController.js
const { Review } = require('../models');

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

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { review, rating, username, image } = req.body;

    // Check if necessary fields are provided
    if (!review || rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new review using data from req.body
    const newReview = await Review.create({
      username: username || 'Anonymous', // Use 'Anonymous' if username is not provided
      image: image || null, // Use null if no image is provided
      review,
      rating,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
