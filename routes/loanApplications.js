const express = require('express');
const router = express.Router();
const { createApplication, getApplicationById } = require('../controllers/LoanApplicationController');

// POST /api/loan-applications/submit
router.post('/submit', createApplication);

// GET /api/loan-applications/:id
router.get('/:id', getApplicationById);

module.exports = router;
