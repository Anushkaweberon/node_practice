const fs = require('fs');
const pdf = require('pdf-parse');

function findValidYearAndMonth(text) {
    const now = new Date();
      const year = now.getFullYear().toString();
    // const year = 2022;
    const month = now.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const bayestMonthName = monthNames[month - 1];
    const carsMonthName = monthNames[month - 2];

    const yearMatches = text.includes(year);
    const bayestMonthMatch = text.includes(bayestMonthName);
    const carsMonthMatch = text.includes(carsMonthName);

    return { yearMatches, bayestMonthMatch, carsMonthMatch };
}

const pdfPath1 = 'contra_costa_detached.pdf';
const pdfPath2 = 'Dublin_detached.pdf';

fs.readFile(pdfPath1, async (error, data) => {
    if (error) {
        console.error('Error reading the first PDF file:', error);
        return;
    }

    try {
        const pdfData = await pdf(data);
        const text = pdfData.text;
        const { yearMatches, carsMonthMatch } = findValidYearAndMonth(text);

        console.log(`For the first PDF: Year found ${yearMatches ? 'Yes' : 'No'},Cars Month found ${carsMonthMatch ? 'Yes' : 'No'}`);
    } catch (err) {
        console.error('Error parsing the first PDF:', err);
    }
});

fs.readFile(pdfPath2, async (error, data) => {
    if (error) {
        console.error('Error reading the second PDF file:', error);
        return;
    }

    try {
        const pdfData = await pdf(data);
        const text = pdfData.text;
        const { yearMatches, bayestMonthMatch } = findValidYearAndMonth(text);

        console.log(`For the second PDF: Year found ${yearMatches ? 'Yes' : 'No'}, Bayest Month found ${bayestMonthMatch ? 'Yes' : 'No'}`);
    } catch (err) {
        console.error('Error parsing the second PDF:', err);
    }
});
