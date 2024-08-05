require('dotenv').config();
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { auth, admin } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Retrieve JWT secret from environment variables
const jwtSecret = process.env.JWT_SECRET;



// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword); // Log the hashed password

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received:', req.body);

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found, hashed password:', user.password); // Log the hashed password

    // Check password
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match); // Log the result of the comparison

    if (match === true) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('userId',user.id, user.role);
    // Generate JWT token
     const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '24h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Admin: Fetch all users
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
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
    console.error('Error updating user:', error);
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
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
