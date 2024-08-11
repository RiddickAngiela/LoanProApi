const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer'); // Import multer

// Import models
const { sequelize } = require('./models');

// Import routes
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');
const fileRoutes = require('./routes/files');
const adminRoutes = require('./routes/admin');
const eligibilityCheckRoutes = require('./routes/eligibilityCheckRoutes');
const loanApplicationsRouter = require('./routes/loanApplications');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage }); // Create multer instance with configuration

// Middleware
app.use(cors()); // Use CORS middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use('/uploads', express.static('uploads')); // Serve static files from uploads

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes); // Include admin routes
app.use('/api/eligibility-check', upload.single('bankStatements'), eligibilityCheckRoutes); // Include eligibility check routes with multer
app.use('/api/loan-applications', loanApplicationsRouter); // Include loan applications routes

// Catch-all handler to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack
  res.status(500).send('Something broke!'); // Send generic error response
});

// Sync models with the database and start the server
const startServer = async () => {
  try {
    await sequelize.authenticate(); // Authenticate database connection
    await sequelize.sync(); // Sync models with the database
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error syncing database:', error); // Log sync errors
    process.exit(1); // Exit process with error code
  }
};

startServer();
