const { EligibilityCheck } = require('../models');
const { validationResult } = require('express-validator');

// Create eligibility check
module.exports.createEligibilityCheck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, idNumber, age, employmentStatus, workId, nextOfKin, accountNumber, dateOfBirth, gender } = req.body;
    const bankStatements = req.file ? req.file.path : '';

    const newEligibilityCheck = await EligibilityCheck.create({
      firstName,
      lastName,
      idNumber,
      age,
      bankStatements,
      employmentStatus,
      workId,
      nextOfKin,
      accountNumber,
      dateOfBirth,
      gender
    });

    res.status(201).json(newEligibilityCheck);
  } catch (error) {
    console.error('Error creating eligibility check:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
