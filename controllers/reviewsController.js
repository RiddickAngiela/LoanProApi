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
    const { review, rating, image } = req.body;

    if (!review || rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const username = req.user?.username;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const newReview = await Review.create({
      username,
      image: image || null,
      review,
      rating,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
