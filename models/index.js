const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Load configuration
const config = require(path.join(__dirname, '..', 'config', 'config.json'));
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false // Set to true to see SQL queries in the console
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connection established.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Load models dynamically
const db = {};
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
