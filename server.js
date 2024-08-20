const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');
const { sequelize } = require('./models'); // Ensure this import matches your file structure
const loanApplicationsRouter = require('./routes/loanApplications');
const loanApprovalRoutes = require('./routes/loanapproval');

dotenv.config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });



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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route handlers
app.use('/api/users', require('./routes/users'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/files', require('./routes/files'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/eligibility-check', upload.single('bankStatements'), require('./routes/eligibilityCheckRoutes'));
app.use('/api/loan-applications', loanApplicationsRouter);
app.use('/api/loanapproval', loanApprovalRoutes);
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/profile', require('./routes/profile'));

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
  app.close(() => {
    console.log('HTTP server closed.');
    sequelize.close().then(() => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
};

// API endpoint to get LOAN details
app.post('/api/loans-Ai', async (req, res) => {
  const { loanInfo } = req.body;

  if (!loanInfo) {
      return res.status(400).json({ error: 'Loan name is required' });
  }

  try {
      // Create a prompt to get ingredients and nutritional values
      const prompt = "Anything about loans and financial literacy only";

      // Generate content using the Gemini API
      const result = await model.generateContent(prompt);  
      const response = await result.response;

      // Send the generated details back to the client
      res.json({ details: response.text() });
  } catch (error) {
      console.error('Error generating loan details:', error);
      res.status(500).json({ error: 'Failed to generate loan details' });
  }
});

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

startServer();