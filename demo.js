const fs = require('fs');
const https = require('https');
const path = require('path');
const svg2pdf = require('svg2pdf').setInkscapePath('/path/to/inkscape');


const getCurrentYearAndMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const bayestMonthName = monthNames[month-1];
  const carsMonthName = monthNames[month-2];
  return { bayestMonthName, carsMonthName, year, month };
};

const checkSVGUrl = (year, month, filename) => {
  const baseUrl = 'https://blue-weberealty.thrivebrokers.com/marketwatch';
  const url = `${baseUrl}/${year}/${month.toString().padStart(2, '0')}/img/${filename}_detached.svg`;
  return url;
};

const downloadSVGFile = (url, filename) => {
  https.get(url, (response) => {
    const filePath = path.join(__dirname, 'downloads', `${filename}.svg`);
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      console.log(`${filename}.svg downloaded successfully.`);
      convertSVGtoPDF(filePath, filename);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}.svg: ${err.message}`);
  });
};

const convertSVGtoPDF = (svgFilePath, filename) => {
  const pdfFilePath = path.join(__dirname, 'downloads', `${filename}.pdf`);

  fs.readFile(svgFilePath, 'utf8', (err, svgContent) => {
    if (err) {
      console.error(`Error reading ${filename}.svg: ${err.message}`);
      return;
    }

    const pdfStream = fs.createWriteStream(pdfFilePath);

    svg2pdf(svgContent, pdfStream, (error) => {
      if (error) {
        console.error(`Error converting ${filename}.svg to PDF: ${error.message}`);
      } else {
        console.log(`${filename}.pdf created successfully.`);
      }
    });
  });
};

const createDownloadsDirectory = () => {
  const downloadsPath = path.join(__dirname, 'downloads');
  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath);
  }
};

const validateSVGUrls = () => {
  const { year, month } = getCurrentYearAndMonth();
  const filenames = ['contra_costa', 'Dublin', 'Fremont', 'Pleasanton', 'San Ramon'];

  createDownloadsDirectory();

  for (let i = 0; i < filenames.length; i++) {
    const url = checkSVGUrl(year, month, filenames[i]);
    downloadSVGFile(url, filenames[i]);
  }
};

validateSVGUrls();
