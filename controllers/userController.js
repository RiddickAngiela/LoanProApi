// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

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
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Handle user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(user.password);
    console.log(hashedPassword);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log(isMatch);
        console.log(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
    
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

// Handle user logout (Client-side only)
const signOutUser = (req, res) => {
  // Logout action on the server is typically handled on the client side by removing the token
  // So this route might not require a server-side implementation
  res.status(200).json({ message: 'Logged out successfully' });
};


const getUserDetails = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is available from the authenticated token
    const user = await User.findByPk(id, {
      attributes: ['firstName', 'lastName', 'email']
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, signOutUser, getUserDetails };


