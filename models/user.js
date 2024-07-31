// models/user.js
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
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Method to check password
  User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  // Generate JWT token
  User.prototype.generateAuthToken = function () {
    const token = jwt.sign({ id: this.id, role: this.role }, 'your_jwt_secret', { expiresIn: '1h' });
    return token;
  };

  return User;
};
