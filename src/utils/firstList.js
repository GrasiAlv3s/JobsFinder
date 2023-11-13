// eslint-disable-next-line import/no-import-module-exports
import puppeteer from 'puppeteer';

const url = 'https://www.econodata.com.br/maiores-empresas/todo-brasil/tecnologia';
const getFirstList = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: '/tmp/myChromeSession',
  });
  // const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url);
};
export default getFirstList;
