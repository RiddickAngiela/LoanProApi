const { Profile } = require('../models');

// Get profile by username
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { username: req.params.username } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create or update profile
exports.createOrUpdateProfile = async (req, res) => {
  const { username, email, firstName, lastName, bio } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    let profile = await Profile.findOne({ where: { username } });

    if (profile) {
      // Update existing profile
      await Profile.update(
        { email, firstName, lastName, bio, image },
        { where: { username } }
      );
      return res.json({ message: 'Profile updated successfully' });
    } else {
      // Create new profile
      await Profile.create({ username, email, firstName, lastName, bio, image });
      return res.json({ message: 'Profile created successfully' });
    }
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
  try {
    const result = await Profile.destroy({ where: { username: req.params.username } });
    if (result === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
