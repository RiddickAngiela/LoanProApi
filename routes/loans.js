// routes/loans.js
const express = require('express');
const router = express.Router();
const { Loan } = require('../models');

// Handle different types of requests
router.post('/', async (req, res) => {
  const { type, id, ...data } = req.body;

  try {
    switch (type) {
      case 'CREATE':
        // Create a new loan
        const newLoan = await Loan.create(data);
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
