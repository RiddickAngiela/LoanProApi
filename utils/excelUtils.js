// utils/excelUtils.js
const ExcelJS = require('exceljs');
const path = require('path');

const createExcel = async (data, outputFilePath) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Add headers
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Amount', key: 'amount', width: 15 }
  ];

  // Add data
  data.forEach(item => {
    worksheet.addRow(item);
  });

  await workbook.xlsx.writeFile(outputFilePath);

  return outputFilePath;
};

module.exports = { createExcel };
