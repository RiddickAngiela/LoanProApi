const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Profile } = require('../models');

// Handle user registration
const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

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
      lastName
    });

    // Create profile for the new user
    await Profile.create({
      username: email, // Assuming email as username or modify as needed
      email,
      firstName,
      lastName
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log(password);

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
    const isMatch2 = await user.comparePassword(password);
    console.log(isMatch2);
    const isMatch = await bcrypt.compare(password, user.password);

    console.log(isMatch);
   
    console.log(user.password);
   
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
      // Create a new profile if it doesn't exist
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
  // Logout action on the server is typically handled on the client side by removing the token
  // So this route might not require a server-side implementation
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is available from the authenticated token
    const user = await User.findByPk(id, {
      attributes: ['firstName', 'lastName', 'email']
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Optionally, you can also fetch the user's profile here
    const profile = await Profile.findOne({ where: { username: user.email } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({ user, profile });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, signOutUser, getUserDetails };
