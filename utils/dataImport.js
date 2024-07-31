// utils/dataImport.js
const XLSX = require('xlsx');
const validator = require('validator');

// Function to read and parse the Excel file
const readExcelFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assume the first sheet
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  return data;
};

// Function to validate data
const validateData = (data) => {
  return data.map((item) => {
    let errors = [];

    // Check for missing required fields
    if (!item.name || typeof item.name !== 'string') {
      errors.push('Missing or invalid name');
    }

    if (!item.email || !validator.isEmail(item.email)) {
      errors.push('Invalid email address');
    }

    if (!item.phone || !validator.isMobilePhone(item.phone, 'any', { strictMode: false })) {
      errors.push('Invalid phone number');
    }

    // Additional validations can be added here

    return {
      ...item,
      errors: errors.length > 0 ? errors : null
    };
  });
};

module.exports = { readExcelFile, validateData };
