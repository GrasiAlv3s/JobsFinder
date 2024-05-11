import puppeteer from "puppeteer";
import { urlList } from "../../link.js";
import fs from "fs";

async function searchJobs(searchQuery) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "/tmp/myChromeSession",
  });

  let allJobs = [];

  try {
    const page = await browser.newPage();
    const ListSearch = [
      "front",
      // "back",
      // "fullstack",
      // "devops",
      // "mobile",
      // searchQuery,
    ];

    for (const url of urlList) {
      for (const query of ListSearch) {
        try {
          await page.goto(url.link, { waitUntil: "networkidle0" });
          const inputSelector = '[data-testid="job-search"]';
          await page.waitForSelector(inputSelector);
          await page.click(inputSelector);
          await page.type(inputSelector, query);
          await page.keyboard.press("Enter");

          const vagas = await page.evaluate(() => {
            const itens = Array.from(
              document.querySelectorAll('ul[data-testid="job-list__list"] > li')
            );
            // const result {}
            return itens.map((li) => {
              const nomeVaga = li.querySelector(
                "div>  div:nth-child(1)"
              )?.innerText;
              const modeloVaga = li.querySelector(
                "div>  div:nth-child(2)"
              )?.innerText;
              const linkVaga = li.querySelector(
                'a[data-testid="job-list__listitem-href"]'
              )?.href;
              console.log("modeloVaga: ", modeloVaga);
              return { nomeVaga, linkVaga, modeloVaga };
            });
          });

          allJobs = allJobs.concat(vagas);
        } catch (err) {
          console.error(`Erro ao processar a URL ${url}: ${err}`);
        }
      }
    }
  } catch (err) {
    console.error(`Erro geral: ${err}`);
  } finally {
    await browser.close();
    fs.writeFile("jobResults.json", JSON.stringify(allJobs, null, 2), (err) => {
      if (err) {
        console.error("Erro ao salvar o arquivo:", err);
      } else {
        console.log("Dados salvos em jobResults.json");
      }
    });
  }
}
export default searchJobs;
