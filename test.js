const fs = require('fs');
const https = require('https');
const path = require('path');

const getCurrentYearAndMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const bayestMonthName = monthNames[month-1];
  const carsMonthName = monthNames[month-2];
  // console.log(carsMonthName, bayestMonthName, year);
  return{bayestMonthName, carsMonthName , year, month}
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
      readSVGFile(filePath, filename); // Read the downloaded SVG file
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}.svg: ${err.message}`);
  });
};

const readSVGFile = (filePath, filename) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(`Error reading ${filename}.svg: ${err.message}`);
      return;
    }
    console.log(`Successfully read ${filename}.svg`);
    const svgContent = data.toString();

    const { year ,bayestMonthName, carsMonthName } = getCurrentYearAndMonth();

    const yearMatch = svgContent.match("Dublin");
    // const monthMatch = svgContent.match(monthRegex);

    console.log(svgContent);
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
