// utils/uploads.js
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const archiver = require('archiver');
const fs = require('fs');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const resizeImage = async (filePath, width, height) => {
  const outputFilePath = filePath.replace(/(\.[\w\d_-]+)$/i, '_resized$1');
  await sharp(filePath)
    .resize(width, height)
    .toFile(outputFilePath);
  return outputFilePath;
};

const zipFiles = (filePaths, zipPath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Set the compression level
    });

    output.on('close', () => resolve());
    archive.on('error', err => reject(err));

    archive.pipe(output);

    filePaths.forEach(filePath => {
      archive.file(filePath, { name: path.basename(filePath) });
    });

    archive.finalize();
  });
};

module.exports = { upload, resizeImage, zipFiles };
