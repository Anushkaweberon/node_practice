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

const validateSVGUrls = () => {
  const { year, month } = getCurrentYearAndMonth();
  const filenames = ['contra_costa', 'Dublin', 'Fremont', 'Pleasanton', 'San Ramon'];
  const validUrls = [];

  for (let i = 0; i < filenames.length; i++) {
    const url = checkSVGUrl(year, month, filenames[i]);
    validUrls.push(url);
  }

  return validUrls;
};

const validMonthAndYear = () => {
  const urls = validateSVGUrls();
  console.log(urls)
};

validMonthAndYear();
