const multer = require('multer');
const sharp = require('sharp');

// Define storage for the images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
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
