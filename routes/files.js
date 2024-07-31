// routes/files.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { upload, resizeImage } = require('../utils/upload');

// Upload and resize image route
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // File path
  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

  // Resize the image if it's a .jpg or .png file
  if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
    await resizeImage(filePath, 800, 600); // Resize to 800x600
  }

  res.status(200).json({ message: 'File uploaded and resized successfully', file: req.file });
});

module.exports = router;
