// models/loan.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
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
  }, {});

  Loan.associate = function(models) {
    // associations can be defined here
  };

  return Loan;
};
