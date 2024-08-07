const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');
const fileRoutes = require('./routes/files');
const adminRoutes = require('./routes/admin'); // Include admin routes
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes); // Include admin routes

// Basic routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// Sync models with the database and start the server
const startServer = async () => {
  try {
    await sequelize.sync();
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
