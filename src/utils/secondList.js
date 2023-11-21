const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Substitua 'URL_DA_PÁGINA' pela URL da página que contém a lista
  await page.goto('URL_DA_PÁGINA');

  const vagas = await page.evaluate(() => {
    const itens = Array.from(document.querySelectorAll('ul[data-testid="job-list__list"] > li'));
    return itens.map((li) => {
      const nomeVaga = li.querySelector('div.sc-d868c80d-5.exscXv')?.innerText;
      const linkVaga = li.querySelector('a[data-testid="job-list__listitem-href"]')?.href;
      return { nomeVaga, linkVaga };
    });
  });

  console.log(vagas);

  await browser.close();
})();