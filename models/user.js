'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
  }, {});

  // Hash password before saving
  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        console.log('Password hashed:', user.password); // Log the hashed password
      } catch (error) {
        console.error('Error hashing password:', error);
      }
    }
  });

  // Method to check password
  User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  // Generate JWT token
  User.prototype.generateAuthToken = function () {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id: this.id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  };

  return User;
};
