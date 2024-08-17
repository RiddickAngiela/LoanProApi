const express = require('express');
const router = express.Router();
const loanApprovalController = require('../controllers/LoanApprovalController');


router.post('/submit', loanApprovalController.submitLoanApplication);

module.exports = router;



