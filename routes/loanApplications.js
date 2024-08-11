const express = require('express');
const router = express.Router();
const { createApplication } = require('../controllers/LoanApplicationController');

router.post('/submit', createApplication);

module.exports = router;
