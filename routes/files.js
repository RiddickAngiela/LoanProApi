// routes/files.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { upload, resizeImage, zipFiles } = require('../utils/uploads');

// Upload and resize image route
router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const filePaths = req.files.map(file => file.path);

    // If the uploaded files include images, resize them
    const resizePromises = req.files
      .filter(file => ['image/jpeg', 'image/png'].includes(file.mimetype))
      .map(file => resizeImage(file.path, 800, 600));

    const resizedImages = await Promise.all(resizePromises);

    // Create a zip archive of the files
    const zipPath = path.join('uploads', `files-${Date.now()}.zip`);
    await zipFiles(filePaths.concat(resizedImages), zipPath);

    res.json({ message: 'Files uploaded, resized, and zipped successfully', zipPath });
  } catch (error) {
    res.status(500).json({ error: `Error processing files: ${error.message}` });
  }
});

module.exports = router;
