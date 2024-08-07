// routes/pdf.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { createPDF } = require('../utils/pdfUtils');
const { models } = require('../models');

router.get('/generate-pdf', async (req, res) => {
  try {
    const data = await models.Loan.findAll();
    const outputFilePath = path.join(__dirname, '..', 'uploads', `report-${Date.now()}.pdf`);
    const imagePath = path.join(__dirname, '..', 'uploads', 'image.png'); // Example image path

    await createPDF(data, imagePath, outputFilePath);

    res.download(outputFilePath);
  } catch (error) {
    res.status(500).json({ error: `Error generating PDF: ${error.message}` });
  }
});

module.exports = router;
