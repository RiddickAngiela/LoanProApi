// routes/loans.js
const express = require('express');
const router = express.Router();
const { Loan } = require('../models');
const { sendEmail } = require('../utils/notificationUtils');

// Handle different types of requests
router.post('/', async (req, res) => {
  const { type, id, ...data } = req.body;

  try {
    switch (type) {
      case 'CREATE':
        // Create a new loan
        const newLoan = await Loan.create(data);

        // Send email notification on loan creation
        await sendEmail(
          data.email,
          'Loan Application Received',
          `Your loan application for ${data.amount} has been received and is under review.`
        );

        res.status(201).json(newLoan);
        break;

      case 'READ':
        if (id) {
          // Read a single loan by ID
          const loan = await Loan.findByPk(id);
          if (loan) {
            res.json(loan);
          } else {
            res.status(404).json({ error: 'Loan not found' });
          }
        } else {
          // Read all loans with pagination
          const { page = 1, limit = 10 } = data;
          const loans = await Loan.findAndCountAll({
            limit: parseInt(limit),
            offset: (page - 1) * limit,
          });
          res.json({
            total: loans.count,
            totalPages: Math.ceil(loans.count / limit),
            currentPage: parseInt(page),
            data: loans.rows,
          });
        }
        break;

      case 'UPDATE':
        // Update a loan by ID
        const [updated] = await Loan.update(data, {
          where: { id },
        });
        if (updated) {
          const updatedLoan = await Loan.findByPk(id);

          // Send email notification on loan update
          await sendEmail(
            updatedLoan.email,
            'Loan Application Updated',
            `Your loan application with ID ${id} has been updated.`
          );

          res.json(updatedLoan);
        } else {
          res.status(404).json({ error: 'Loan not found' });
        }
        break;

      case 'DELETE':
        // Delete a loan by ID
        const deleted = await Loan.destroy({
          where: { id },
        });
        if (deleted) {
          // Send email notification on loan deletion
          await sendEmail(
            req.body.email,
            'Loan Application Deleted',
            `Your loan application with ID ${id} has been deleted.`
          );
          res.status(204).end();
        } else {
          res.status(404).json({ error: 'Loan not found' });
        }
        break;

      default:
        res.status(400).json({ error: 'Invalid request type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;