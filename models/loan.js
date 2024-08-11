// models/loan.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Loan extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  Loan.init({
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    term: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Loan',
  });

  return Loan;
};
