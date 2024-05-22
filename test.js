const fs = require('fs');
const https = require('https');
const path = require('path');
const puppeteer = require('puppeteer');
const PDFParser = require('pdf-parse');

const getCurrentYearAndMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const bayestMonthName = monthNames[month - 1];
  const carsMonthName = monthNames[month - 2];
  return { bayestMonthName, carsMonthName, year, month };
};

const checkSVGUrl = (year, month, filename) => {
  const baseUrl = 'https://blue-weberealty.thrivebrokers.com/marketwatch';
  const url = `${baseUrl}/${year}/${month.toString().padStart(2, '0')}/img/${filename}_detached.svg`;
  return url;
};

const downloadSVGFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const filePath = path.join(__dirname, 'downloads', `${filename}.svg`);
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        console.log(`${filename}.svg downloaded successfully.`);
        resolve(filePath);
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${filename}.svg: ${err.message}`);
      reject(err);
    });
  });
};

const convertSVGToPDF = async (inputSvg, outputPdf) => {
  const html = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
          }
        </style>
        <script>
          async function init() {
            const element = document.getElementById('targetsvg');
            const positionInfo = element.getBoundingClientRect();
            const height = positionInfo.height;
            const width = positionInfo.width;
            const style = document.createElement('style');
            style.innerHTML = \`@page {margin: 0; size: \${width}px \${height}px}\`;
            document.head.appendChild(style);
          }
          window.onload = init;
        </script>
      </head>
      <body>
        <img id="targetsvg" src="${inputSvg}">
      </body>
    </html>
  `;

  const tmpfile = 'temp.html'; 

  fs.writeFileSync(tmpfile, html);

  const absoluteFilePath = `file://${__dirname}/${tmpfile}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(absoluteFilePath, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPdf, format: 'A4' });
  await browser.close();

  fs.unlinkSync(tmpfile);
  console.log(`PDF generated successfully: ${outputPdf}`);

  fs.unlinkSync(inputSvg);
  console.log(`SVG file deleted: ${inputSvg}`);
};

const createDownloadsDirectory = () => {
  const downloadsPath = path.join(__dirname, 'downloads');
  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath);
  }
};

const extractInfoFromPDF = async (pdfPath, txtFilePath) => {
    const { year, bayestMonthName } = getCurrentYearAndMonth();
    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const pdfText = await PDFParser(dataBuffer);
      const text = pdfText.text;
      console.log("Extracted PDF text:", text);
      fs.writeFileSync(txtFilePath, text);
      console.log(`PDF content saved to: ${txtFilePath}`);
      const pdfyear = text.match(year);
      const month = text.match(bayestMonthName);
      return { pdfyear, month };
    } catch (error) {
      console.error('Error extracting info from PDF:', error);
      throw error;
    }
  };
  
  

const validateSVGUrls = async () => {
  try {
    const { year, month } = getCurrentYearAndMonth();
    const filenames = ['contra_costa', 'Dublin', 'Fremont', 'Pleasanton', 'San Ramon'];

    createDownloadsDirectory();

    for (const filename of filenames) {
      const url = checkSVGUrl(year, month, filename);
      const svgFilePath = await downloadSVGFile(url, filename);
      const pdfFilePath = path.join(__dirname, 'downloads', `${filename}.pdf`);
      const txtFilePath = path.join(__dirname, 'downloads', `${filename}.txt`); 
      await convertSVGToPDF(svgFilePath, pdfFilePath);
      await extractInfoFromPDF(pdfFilePath, txtFilePath); 
      const pdfInfo = await extractInfoFromPDF(pdfFilePath, txtFilePath);
      console.log(`${filename} PDF info - Year: ${pdfInfo.year}, Month: ${pdfInfo.month}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

validateSVGUrls();
