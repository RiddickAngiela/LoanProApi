// routes/excel.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { createExcel } = require('../utils/excelUtils');
const { models } = require('../models');

router.get('/generate-excel', async (req, res) => {
  try {
    const data = await models.Loan.findAll();
    const outputFilePath = path.join(__dirname, '..', 'uploads', `report-${Date.now()}.xlsx`);

    await createExcel(data, outputFilePath);

    res.download(outputFilePath);
  } catch (error) {
    res.status(500).json({ error: `Error generating Excel: ${error.message}` });
  }
});

module.exports = router;
