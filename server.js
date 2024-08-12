const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');
const { sequelize } = require('./models');

// Import routes
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');
const fileRoutes = require('./routes/files');
const adminRoutes = require('./routes/admin');
const eligibilityCheckRoutes = require('./routes/eligibilityCheckRoutes');
const loanApplicationsRouter = require('./routes/loanApplications');
const reviewRoutes = require('./routes/reviews');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/eligibility-check', upload.single('bankStatements'), eligibilityCheckRoutes);
app.use('/api/loan-applications', loanApplicationsRouter);
app.use('/api/reviews', reviewRoutes);

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all handler to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
  } else if (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    next();
  }
});

// Sync models with the database and start the server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const handleShutdown = (signal) => {
  console.log(`Received ${signal}. Closing HTTP server.`);
  server.close(() => {
    console.log('HTTP server closed.');
    sequelize.close().then(() => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

startServer();
