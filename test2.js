const fs = require('fs');
const axios = require('axios');
const svg2pdf = require('svg2pdf');
const pdfText = require('pdf-text-extract');

async function downloadSVG(url, filename) {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(filename));
    return new Promise((resolve, reject) => {
        response.data.on('end', () => {
            resolve();
        });
        response.data.on('error', (err) => {
            reject(err);
        });
    });
}

async function convertSVGtoPDF(svgPath, pdfPath) {
    const svgData = fs.readFileSync(svgPath, 'utf8');
    const pdfStream = fs.createWriteStream(pdfPath);
    return new Promise((resolve, reject) => {
        svg2pdf(svgData, pdfStream, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function searchPDFForYear(pdfPath, year) {
    return new Promise((resolve, reject) => {
        pdfText(pdfPath, (err, chunks) => {
            if (err) reject(err);
            else {
                const text = chunks.join('');
                resolve(text.includes(year));
            }
        });
    });
}

async function main() {
    const svgUrl = 'https://blue-weberealty.thrivebrokers.com/marketwatch/2024/02/img/contra_costa_detached.svg';
    const svgFilename = 'contra_costa_detached.svg';
    const pdfFilename = 'contra_costa_detached.pdf';
    const yearToFind = '2022';

    try {
        // Download SVG
        await downloadSVG(svgUrl, svgFilename);
        console.log('SVG downloaded successfully.');

        // Convert SVG to PDF
        await convertSVGtoPDF(svgFilename, pdfFilename);
        console.log('SVG converted to PDF.');

        // Search PDF for the year
        const yearFound = await searchPDFForYear(pdfFilename, yearToFind);
        console.log('Year found in PDF:', yearFound);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
