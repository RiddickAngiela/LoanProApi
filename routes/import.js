// routes/import.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { readExcelFile, validateData } = require('../utils/dataImport');
const { sequelize, models } = require('../models');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Import data route
router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

  try {
    const data = readExcelFile(filePath);
    const validatedData = validateData(data);

    // Separate valid and invalid data
    const validRecords = validatedData.filter(item => !item.errors);
    const invalidRecords = validatedData.filter(item => item.errors);

    // Insert valid records into the database
    if (validRecords.length > 0) {
      await models.Loan.bulkCreate(validRecords.map(item => ({
        amount: item.amount,
        term: item.term,
        applicant: item.name // Map fields accordingly
      })));
    }

    res.status(200).json({
      message: 'Data import completed',
      validRecords: validRecords.length,
      invalidRecords: invalidRecords
    });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Failed to import data' });
  }
});

module.exports = router;
