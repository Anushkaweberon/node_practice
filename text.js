const fs = require('fs');
const https = require('https');
const path = require('path');

const getCurrentYearAndMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return { year, month };
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
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}.svg: ${err.message}`);
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
