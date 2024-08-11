const { LoanApplication } = require('../models');


exports.createApplication = async (req, res) => {
  try {
    const { fullName, dob, address, annualIncome, loanAmount, loanPurpose, repaymentTerm } = req.body;

    if (!fullName || !dob || !address || !annualIncome || !loanAmount || !loanPurpose || !repaymentTerm) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newApplication = await LoanApplication.create({
      fullName,
      dob,
      address,
      annualIncome,
      loanAmount,
      loanPurpose,
      repaymentTerm
    });

    res.status(201).json(newApplication);
  } catch (error) {
    console.error('Error creating loan application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
