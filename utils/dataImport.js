// utils/dataImport.js
const xlsx = require('xlsx');

const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  return data;
};

const validateData = (data) => {
  return data.map(item => {
    const errors = [];
    if (!item.amount || isNaN(item.amount)) errors.push('Invalid amount');
    if (!item.term || isNaN(item.term)) errors.push('Invalid term');
    if (!item.name || item.name.trim() === '') errors.push('Name is required');

    return { ...item, errors: errors.length > 0 ? errors : null };
  });
};

module.exports = { readExcelFile, validateData };
