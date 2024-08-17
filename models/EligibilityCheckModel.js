'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EligibilityCheck = sequelize.define('EligibilityCheck', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bankStatements: {
      type: DataTypes.STRING,
      allowNull: true
    },
    employmentStatus: {
      type: DataTypes.STRING,
      allowNull: false
    },
    workId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nextOfKin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return EligibilityCheck;
};
