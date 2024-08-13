const express = require('express');
const { auth } = require('../middleware/auth');
const { upload } = require('../utils/uploads'); // Corrected import path

const profileController = require('../controllers/profileController');

const router = express.Router();

// Get profile by username
router.get('/:username', auth, profileController.getProfile);

// Create or update profile
router.post('/', auth, upload.single('image'), profileController.createOrUpdateProfile);

// Delete profile
router.delete('/:username', auth, profileController.deleteProfile);

module.exports = router;
