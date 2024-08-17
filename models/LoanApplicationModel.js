'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LoanApplication = sequelize.define('LoanApplication', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    annualIncome: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    loanAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    loanPurpose: {
      type: DataTypes.STRING,
      allowNull: false
    },
    repaymentTerm: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // status: {
    //   type: DataTypes.STRING,
    //   defaultValue: 'pending'
    // }
  });

  return LoanApplication;
};

