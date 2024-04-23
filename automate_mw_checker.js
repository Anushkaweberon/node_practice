const fs = require('fs');
const pdf = require('pdf-parse');
const yargs = require('yargs');

const argv = yargs(process.argv.slice(2))
    .usage('Usage: $0 <pdfPath>')
    .demandCommand(1, 'Please provide the path to the PDF file.')
    .argv;

    function findValidYearAndMonth(text) {
        const today = new Date();
        let year = today.getFullYear().toString();
    
        const previousMonth = new Date(today);
        previousMonth.setMonth(today.getMonth() - 1);
        const bayeastMonthName = previousMonth.toLocaleString('default', { month: 'long' });
        let previousYear = previousMonth.getFullYear().toString();
    
        const twoMonthsAgo = new Date(today);
        twoMonthsAgo.setMonth(today.getMonth() - 2);
        const carsMonthName = twoMonthsAgo.toLocaleString('default', { month: 'long' });
        let twoMonthsAgoYear = twoMonthsAgo.getFullYear().toString();
    
        const bayeastMonthMatch = text.includes(bayeastMonthName);
        let previousYearMatch = false;
        let twoMonthsAgoYearMatch = false;
    
        if (bayeastMonthMatch) {
            previousYearMatch = text.includes(previousYear);
        } else {
            twoMonthsAgoYearMatch = text.includes(twoMonthsAgoYear);
        }
    
        const carsMonthMatch = text.includes(carsMonthName);
        console.log(`bayeast month ${bayeastMonthMatch}, cars month ${carsMonthMatch}, previous year ${previousYearMatch}, two months ago year ${twoMonthsAgoYearMatch}`)
    
        return { year, previousYearMatch, bayeastMonthMatch, twoMonthsAgoYearMatch,carsMonthMatch };
    }
    
    
    
const pdfPath = argv._[0];

fs.readFile(pdfPath, async (error, data) => {
    if (error) {
        console.error('Error reading the PDF file:', error);
        return;
    }

    try {
        const pdfData = await pdf(data);
        const { year, previousYearMatch, bayeastMonthMatch, twoMonthsAgoYearMatch,carsMonthMatch } = findValidYearAndMonth(pdfData.text, pdfPath);

        console.log(`For the ${pdfPath}: Year found in CARs stats: ${twoMonthsAgoYearMatch ? 'Yes' : 'No'}, Year found in Bayeast stats: ${previousYearMatch ? 'Yes' : 'No'}, Bayest Month found: ${bayeastMonthMatch ? 'Yes' : 'No'}, Cars Month found: ${carsMonthMatch ? 'Yes' : 'No'}`);
    } catch (err) {
        console.error('Error parsing the PDF:', err);
    }
});
