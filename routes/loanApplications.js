const express = require('express');
const router = express.Router();
const { createApplication, getApplicationById } = require('../controllers/LoanApplicationController');


router.post('/submit', createApplication);

router.get('/:id', getApplicationById);

module.exports = router;
