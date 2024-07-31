// server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans'); // Add this line

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Middleware to parse JSON requests
app.use('/uploads', express.static('uploads')); 

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes); // Add this line

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Sync models with the database and start the server
const startServer = async () => {
  try {
    await sequelize.sync(); // Sync models with the database
    console.log('Database & tables created!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1); 
  }
};

startServer();
