const fs = require('fs').promises;
const pdf = require('pdf-parse');
const yargs = require('yargs');
const axios = require('axios');
const nodemailer = require('nodemailer');

const baseUrl = 'https://blue-weberealty.thrivebrokers.com/marketwatch';
const filenames = ['contra_costa', 'Dublin', 'Fremont', 'Pleasanton', 'San Ramon'];

async function checkSVGUrl(year, month, filename) {
    const url = `${baseUrl}/${year}/${month.toString().padStart(2, '0')}/img/${filename}_detached.svg`;
    try {
        const response = await axios.head(url);
        return response.status;
    } catch (error) {
        console.error(`Error checking URL ${url}:`, error.message);
        return null;
    }
}

function findValidYearAndMonth(text) {
    const today = new Date();
    const previousMonth = new Date();
    previousMonth.setMonth(today.getMonth() - 2);
    const bayeastStatsMonthName = previousMonth.toLocaleString('default', { month: 'long' });
    const bayeastStatsYear = previousMonth.getFullYear().toString();

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 3);
    const carsMonthStatsName = twoMonthsAgo.toLocaleString('default', { month: 'long' });
    const carsStatsYear = twoMonthsAgo.getFullYear().toString();

    const BAYEAST_STATS_STRING = `Detached Single-Family Homes${bayeastStatsMonthName}  ${bayeastStatsYear}`;
    const CARS_STATS_STRING = `Trends At A Glance For: ${carsMonthStatsName} ${carsStatsYear}`;

    const bayeastStatsMatch = text.includes(BAYEAST_STATS_STRING);
    const carsStatsMatch = text.includes(CARS_STATS_STRING);

    return { bayeastStatsMatch, carsStatsMatch };
}

const argv = yargs(process.argv.slice(2))
    .usage('Usage: $0 <pdfPath1> <pdfPath2> <pdfPath3> <pdfPath4> <pdfPath5>')
    .demandCommand(1, 'Please provide at least one path to the PDF file.')
    .argv;

const pdfPaths = argv._;

async function processPDF(pdfPath) {
    try {
        const data = await fs.readFile(pdfPath);
        const pdfData = await pdf(data);
        const { bayeastStatsMatch, carsStatsMatch } = findValidYearAndMonth(pdfData.text);
        console.log(`For the ${pdfPath}: CarsStats match ${carsStatsMatch ? "yes" : "No"}, BayeastStats match ${bayeastStatsMatch ? "yes" : "No"}`);
        return { pdfPath, bayeastStatsMatch, carsStatsMatch };
    } catch (error) {
        console.error(`Error processing the PDF file ${pdfPath}:`, error);
        return { pdfPath, bayeastStatsMatch: false, carsStatsMatch: false };
    }
}

(async () => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = today.getMonth();

    for (const filename of filenames) {
        try {
            const status = await checkSVGUrl(year, month, filename);
            console.log(`Status for ${filename}_detached.svg: ${status}`);
        } catch (error) {
            console.error(`Error checking ${filename}_detached.svg: ${error.message}`);
        }
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'anushka@weberon.net',
            pass: 'Anushka@123'
        }
    });

    for (const pdfPath of pdfPaths) {
        const { bayeastStatsMatch, carsStatsMatch } = await processPDF(pdfPath);

        const mailOptions = {
            from: 'anushka@weberon.net',
            to: (bayeastStatsMatch || carsStatsMatch) ? 'anushkavishwari01@gmail.com' : 'anushkavishwari00@gmail.com',
            subject: 'PDF Processing Notification',
            text: `The PDF ${pdfPath} ${bayeastStatsMatch || carsStatsMatch ? 'matches the required stats.' : 'does not match the required stats.'}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email notification:', error);
            } else {
                console.log('Email notification sent successfully:', info.response);
            }
        });
    }
})();
