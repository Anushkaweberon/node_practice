const fs = require('fs');
const pdf = require('pdf-parse');

function findValidYearAndMonth(text) {
    const now = new Date();
    // const year = now.getFullYear().toString();
    const year = 2026
    const month = now.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const bayestMonthName = monthNames[month - 1];
    const yearMatches = text.includes(year) ;
    const monthMatch = text.includes(bayestMonthName);
    console.log(yearMatches, year)

    return { yearMatches, monthMatch };
}

const pdfPath = 'Dublin_detached.pdf';
fs.readFile(pdfPath, async (error, data) => {
    if (error) {
        console.error('Error reading the PDF file:', error);
        return;
    }

    try {
        const pdfData = await pdf(data);
        const text = pdfData.text;
        const { yearMatches, monthMatch } = findValidYearAndMonth(text);
        console.log(yearMatches, monthMatch)

        if (yearMatches || monthMatch){
            console.log(`Year found ${yearMatches ? 'Yes' : 'No'}, Bayest Month found ${monthMatch ? 'Yes' : 'No'} in the PDF.`);
        } else {
            console.log('Not found in the PDF.');
        }
    } catch (err) {
        console.error('Error parsing the PDF:', err);
    }
});
