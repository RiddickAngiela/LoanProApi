// utils/pdfUtils.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const createPDF = (data, imagePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const outputStream = fs.createWriteStream(outputFilePath);

    doc.pipe(outputStream);

    // Add data from the database
    doc.fontSize(16).text('Data from the Database', { underline: true });
    doc.moveDown();

    // Add text data
    data.forEach(item => {
      doc.fontSize(12).text(`ID: ${item.id}`);
      doc.fontSize(12).text(`Name: ${item.name}`);
      doc.fontSize(12).text(`Amount: ${item.amount}`);
      doc.moveDown();
    });

    // Embed image
    if (imagePath) {
      doc.addPage();
      doc.image(imagePath, {
        fit: [500, 500],
        align: 'center',
        valign: 'center'
      });
    }

    doc.end();

    outputStream.on('finish', () => {
      resolve(outputFilePath);
    });

    outputStream.on('error', (err) => {
      reject(err);
    });
  });
};

module.exports = { createPDF };
