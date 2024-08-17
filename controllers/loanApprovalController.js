// src/controllers/LoanApprovalController.js
const { LoanApproval } = require('../models');

// Controller for handling loan approval
const LoanApprovalController = {
  // Method to handle loan application submission
  submitLoanApplication: async (req, res) => {
    try {
      const { fullName, dob, address, annualIncome, loanAmount, loanPurpose, repaymentTerm } = req.body;

      // Create a new loan approval entry in the database
      const newLoanApproval = await LoanApproval.create({
        fullName,
        dob,
        address,
        annualIncome,
        loanAmount,
        loanPurpose,
        repaymentTerm,
      });

      res.status(201).json({
        message: 'Loan application submitted successfully',
        loan: newLoanApproval,
      });
    } catch (error) {
      console.error('Error submitting loan application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Other methods (such as fetching, approving, rejecting loans) can be added here
};

module.exports = LoanApprovalController;
