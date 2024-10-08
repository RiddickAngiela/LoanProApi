const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const userController = require('../controllers/userController');
const { upload, resizeImage } = require('../utils/uploads');
const { User } = require('../models');

// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Sign out user
router.post('/signout', auth, userController.signOutUser);

// Admin: Fetch all users
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Admin: Update user
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Admin: Delete user
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Upload profile image
router.post('/profile/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resizedImagePath = await resizeImage(req.file.path, 800, 800);

    const user = await User.findByPk(req.user.id);
    user.profilePicture = resizedImagePath;
    await user.save();

    res.status(200).json({ message: 'Image uploaded and resized successfully', imagePath: resizedImagePath });
  } catch (error) {
    res.status(500).json({ error: 'Error processing image' });
  }
});

// Get authenticated user's profile
router.get('/profile', auth, userController.getUserDetails);

module.exports = router;
