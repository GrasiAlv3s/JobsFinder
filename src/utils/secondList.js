const puppeteer = require('puppeteer');

const url = 'https://www.econodata.com.br/maiores-empresas/todo-brasil/tecnologia';
const getFirstList = async () => {
  console.log('oiii');
  const browser = await puppeteer.launch({ headless: 'new' });

  const page = await browser.newPage();
  console.log('page: ', page);
  await page.goto(url);

  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();
  return data;
};
module.exports = getFirstList;
