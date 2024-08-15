'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true, // Ensures the email format is valid
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
  });

  // Method to check password
  User.prototype.comparePassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('Error comparing password:', error);
      throw new Error('Error comparing password');
    }
  };

  // Generate JWT token
  User.prototype.generateAuthToken = function () {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(
      { id: this.id, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  };

  // Define associations if any
  User.associate = function (models) {
    // Define associations here
    // Example: User.hasMany(models.Post); (if you have a Post model)
  };

  return User;
};
