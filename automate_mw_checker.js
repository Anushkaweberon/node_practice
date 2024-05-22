const fs = require('fs').promises;
const pdf = require('pdf-parse');
const yargs = require('yargs');
const axios = require('axios');
const nodemailer = require('nodemailer');

const baseUrl = 'https://blue-weberealty.thrivebrokers.com/marketwatch';
const filenames = ['contra_costa', 'Dublin', 'Fremont', 'Pleasanton', 'San Ramon'];

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anushka@weberon.net',
        pass: 'Anushka@123'
    }
});

async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'anushka@weberon.net',
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
}

async function checkSVGUrl(year, month, filename) {
    const url = `${baseUrl}/${year}/${month.toString().padStart(2, '0')}/img/${filename}_detached.svg`;
    try {
        const response = await axios.head(url);
        return response.status;
    } catch (error) {
        console.error(`Error checking URL ${url}:`, error.message);
        await sendEmail('anushkavishwari00@gmail.com', 'URL Check Failed', `Error checking URL ${url}: ${error.message}`);
        return null;
    }
}

function findValidYearAndMonth(text) {
    const today = new Date();
    const previousMonth = new Date();
    previousMonth.setMonth(today.getMonth() - 1);
    const bayeastStatsMonthName = previousMonth.toLocaleString('default', { month: 'long' });
    const bayeastStatsYear = previousMonth.getFullYear().toString();

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    const carsMonthStatsName = twoMonthsAgo.toLocaleString('default', { month: 'long' });
    const carsStatsYear = twoMonthsAgo.getFullYear().toString();

    const BAYEAST_STATS_STRING = `Detached Single-Family Homes ${bayeastStatsMonthName}  ${bayeastStatsYear}`;
    const CARS_STATS_STRING = `Trends At A Glance For: ${carsMonthStatsName} ${carsStatsYear}`;

    const bayeastStatsMatch = text.includes(BAYEAST_STATS_STRING);
    const carsStatsMatch = text.includes(CARS_STATS_STRING);

    return { bayeastStatsMatch, carsStatsMatch };
}

const argv = yargs(globalThis.process.argv.slice(2))
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

        if (bayeastStatsMatch || carsStatsMatch) {
            const subject = `Marketwatch stats pdf is available`;
            const text = `The PDF ${pdfPath} matches the required stats.`;
            await sendEmail(
                'anushkavishwari01@gmail.com',
                subject,
                text
            );
        }
    } catch (error) {
        console.error(`Error processing the PDF file ${pdfPath}:`, error);
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

    for (const pdfPath of pdfPaths) {
        await processPDF(pdfPath);
    }
})();