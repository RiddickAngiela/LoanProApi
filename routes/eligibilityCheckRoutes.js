const express = require('express');
const { body, validationResult } = require('express-validator');
const eligibilityCheckController = require('../controllers/eligibilityCheckController');

const router = express.Router();

// Define route with validation
router.post('/',
  [
    body('firstName').isString().notEmpty().withMessage('First name is required'),
    body('lastName').isString().notEmpty().withMessage('Last name is required'),
    body('idNumber').isString().notEmpty().withMessage('ID number is required'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    // Make bankStatements optional
    body('bankStatements').optional().isString().withMessage('Bank statements must be a string'),
    body('employmentStatus').isString().notEmpty().withMessage('Employment status is required'),
    body('workId').isString().notEmpty().withMessage('Work ID is required'),
    body('nextOfKin').isString().notEmpty().withMessage('Next of kin is required'),
    body('accountNumber').isString().notEmpty().withMessage('Account number is required'),
    body('dateOfBirth').isDate().withMessage('Date of birth must be a valid date'),
    body('gender').isString().notEmpty().withMessage('Gender is required')
  ],
  (req, res) => {
    // Validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Call the controller
    eligibilityCheckController.createEligibilityCheck(req, res);
  }
);

module.exports = router;
