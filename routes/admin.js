// routes/admin.js
const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');

// Define your admin routes here

// Example: Get all loans (admin only)
router.get('/loans', auth, admin, async (req, res) => {
  try {
    const loans = await Loan.findAll(); // Assuming you have a Loan model
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example: Get all users (admin only)
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.findAll(); // Assuming you have a User model
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
