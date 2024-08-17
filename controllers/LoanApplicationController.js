const { LoanApplication } = require('../models'); // Adjust path if necessary

exports.createApplication = async (req, res) => {
  try {
    const { fullName, dob, address, annualIncome, loanAmount, loanPurpose, repaymentTerm } = req.body;

    if (!fullName || !dob || !address || !annualIncome || !loanAmount || !loanPurpose || !repaymentTerm ) {
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

exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await LoanApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Error retrieving loan application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
