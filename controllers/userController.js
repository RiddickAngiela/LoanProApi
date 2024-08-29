const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Profile } = require('../models');

// Handle user registration
const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'user', // Default role to 'user' if not provided
    });

    // Create profile for the new user
    const profile = await Profile.create({
      username: email, // Assuming email as username or modify as needed
      email,
      firstName,
      lastName,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      profile
    });
  } catch (error) {
    console.error('Registration Error:', error.message);  // Log the error to identify the issue
    res.status(500).json({ error: 'Server error' });
  }
};

// Handle user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Fetch profile or create it if it doesn't exist
    let profile = await Profile.findOne({ where: { username: email } });
    if (!profile) {
      profile = await Profile.create({
        username: email,
        email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }

    res.status(200).json({ token, profile });
  } catch (error) {
    console.error('Login Error:', error.message);  // Log the error to identify the issue
    res.status(500).json({ error: 'Error logging in' });
  }
};

// Handle user logout (Client-side only)
const signOutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is available from the authenticated token
    const user = await User.findByPk(id, {
      attributes: ['firstName', 'lastName', 'email', 'role'], // Include role in the response
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch the user's profile
    const profile = await Profile.findOne({ where: { username: user.email } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({ user, profile });
  } catch (error) {
    console.error('Error fetching user details:', error.message);  // Log the error to identify the issue
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, signOutUser, getUserDetails };
