const fs = require('fs');
const pdf = require('pdf-parse');
const yargs = require('yargs');

const argv = yargs(process.argv.slice(2))
    .usage('Usage: $0 <pdfPath1> <pdfPath2> <pdfPath3> <pdfPath4> <pdfPath5>')
    .demandCommand(1, 'Please provide at least one path to the PDF file.')
    .argv;

function findValidYearAndMonth(text) {
    const today = new Date();
    let year = today.getFullYear().toString();

    const previousMonth = new Date();
    previousMonth.setMonth(today.getMonth() - 1);
    const bayeastStatsMonthName = previousMonth.toLocaleString('default', { month: 'long' });
    const bayeastStatsYear = previousMonth.getFullYear().toString();

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    const carsMonthStatsName = twoMonthsAgo.toLocaleString('default', { month: 'long' });
    const carsStatsYear = twoMonthsAgo.getFullYear().toString();

    const BAYEAST_STATS_STRING = `Detached Single-Family Homes${bayeastStatsMonthName}  ${bayeastStatsYear}`
    const CARS_STATS_STRING = `Trends At A Glance For: ${carsMonthStatsName} ${carsStatsYear}`

    const bayeastStatsMatch = text.includes(BAYEAST_STATS_STRING);
    const carsStatsMatch = text.includes(CARS_STATS_STRING);

    return { bayeastStatsMatch, carsStatsMatch };
}

const pdfPaths = argv._;

pdfPaths.forEach(async (pdfPath) => {
    fs.readFile(pdfPath, async (error, data) => {
        if (error) {
            console.error(`Error reading the PDF file ${pdfPath}:`, error);
            return;
        }

        try {
            const pdfData = await pdf(data);
            const { bayeastStatsMatch, carsStatsMatch } = findValidYearAndMonth(pdfData.text, pdfPath);
            console.log(`For the ${pdfPath}: CarsStats match ${carsStatsMatch? "yes": "No"}, BayeastStats match ${bayeastStatsMatch? "yes" : "No"}`);
        } catch (err) { 
            console.error('Error parsing the PDF:', err);
        }
    });
});
