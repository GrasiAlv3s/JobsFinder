import puppeteer from "puppeteer";
import { urlList } from "../../link.js"; // Supondo que 'urlList' é um array de URLs.

async function searchJobs(searchQuery) {
  const browser = await puppeteer.launch({
    headless: false, // Altere para true se estiver rodando em produção ou em um ambiente sem GUI.
    defaultViewport: null,
    userDataDir: "/tmp/myChromeSession",
  });

  try {
    const page = await browser.newPage();
    debugger;

    for (const url of urlList) {
      try {
        await page.goto(url, { waitUntil: "networkidle0" }); // Espera até que a rede esteja completamente inativa.
        const inputSelector = '[data-testid="job-search"]';
        await page.waitForSelector(inputSelector);
        await page.click(inputSelector);
        await page.type(inputSelector, searchQuery);
        await page.keyboard.press("Enter");

        const vagas = await page.evaluate(() => {
          const itens = Array.from(
            document.querySelectorAll('ul[data-testid="job-list__list"] > li')
          );
          return itens.map((li) => {
            const nomeVaga = li.querySelector(
              "div.sc-d868c80d-5.exscXv"
            )?.innerText;
            const linkVaga = li.querySelector(
              'a[data-testid="job-list__listitem-href"]'
            )?.href;
            return { nomeVaga, linkVaga };
          });
        });

        console.log(vagas);
      } catch (err) {
        console.error(`Erro ao processar a URL ${url}: ${err}`);
      }
    }
  } catch (err) {
    console.error(`Erro geral: ${err}`);
  } finally {
    // await browser.close();
    console.log("acabou");
  }
}

searchJobs("front");
export default searchJobs;
