// src/models/LoanApprovalModel.js
module.exports = (sequelize, DataTypes) => {
  const LoanApproval = sequelize.define('LoanApproval', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    annualIncome: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    loanAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    loanPurpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repaymentTerm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending', // Default status is 'Pending'
    },
  });

  return LoanApproval;
};
