const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');
const { upload, resizeImage, zipFiles } = require('./utils/uploads');
const path = require('path');
const { generatePdfWithChart } = require('./utils/pdfUtils');

const app = express();
const PORT = process.env.PORT;
const uploadPath = 'uploads/';

// Retrieve JWT secret from environment variables
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(bodyParser.json()); // Middleware to parse JSON requests
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

// File upload route
app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const filePaths = req.files.map(file => file.path);

    // If the uploaded files include images, resize them
    const resizePromises = req.files
      .filter(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.mimetype))
      .map(file => resizeImage(file.path, 800, 600));

    const resizedImages = await Promise.all(resizePromises);

    // Create a zip archive of the files
    const zipPath = path.join(uploadPath, `files-${Date.now()}.zip`);
    await zipFiles(filePaths.concat(resizedImages), zipPath);

    res.json({ message: 'Files uploaded, resized, and zipped successfully', zipPath });
  } catch (error) {
    res.status(500).json({ error: `Error processing files: ${error.message}` });
  }
});

// Generate PDF with chart route
app.post('/generate-report', async (req, res) => {
  try {
    const chartData = req.body.chartData; // Expected to be a Chart.js configuration object

    if (!chartData) {
      return res.status(400).json({ error: 'No chart data provided' });
    }

    const pdfPath = path.join(uploadPath, `report-${Date.now()}.pdf`);
    await generatePdfWithChart(pdfPath, chartData);

    res.json({ message: 'PDF generated successfully', pdfPath });
  } catch (error) {
    res.status(500).json({ error: `Error generating PDF: ${error.message}` });
  }
});

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
