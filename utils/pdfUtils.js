const PDFDocument = require('pdfkit');
const fs = require('fs');
const { createCanvas } = require('canvas');
const Chart = require('chart.js');

const generateChartImage = (chartData) => {
  return new Promise((resolve, reject) => {
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, chartData);

    chart.update();

    canvas.toBuffer((err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer);
    });
  });
};

const generatePdfWithChart = async (pdfPath, chartData) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(pdfPath));

  // Add title
  doc.fontSize(20).text('Chart Report', { align: 'center' });

  // Add chart image
  const chartImage = await generateChartImage(chartData);
  doc.image(chartImage, { fit: [500, 400], align: 'center' });

  doc.end();
};

module.exports = { generatePdfWithChart };
