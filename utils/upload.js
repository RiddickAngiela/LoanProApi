// utils/upload.js
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer
const upload = multer({ storage: storage });

// Resize image function
const resizeImage = async (filePath, width, height) => {
  try {
    await sharp(filePath)
      .resize(width, height)
      .toFile(filePath);
  } catch (error) {
    console.error('Error resizing image:', error);
  }
};

module.exports = { upload, resizeImage };
