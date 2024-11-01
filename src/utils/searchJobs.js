import puppeteer from "puppeteer";
import { urlList } from "../../link.js";
import fs from "fs";
import path from "path";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function searchJobs() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "/tmp/myChromeSession",
  });

  let newJobs = [];
  try {
    const page = await browser.newPage();
    const ListSearch = [

      "estágio",
      "segurança",
      "cyber",
      "security",
      "jr",
      "junior",
    ];

    for (const url of urlList) {
      let companyJobs = { empresa: url.name, vagas: [] };
      for (const query of ListSearch) {
        try {
          await page.goto(url.link, { waitUntil: "networkidle0" });
          const amount = await page.evaluate(() => {
            const amount = document.querySelector(
              'p[data-testid="job-list-amount"]'
            )?.innerText;
            return amount;
          });
          if (amount > 10) {
            console.log("amount: ", amount);
            const itemPorPag = document.querySelector(
              'input[name="items-por-pagina"]'
            );
            if (itemPorPag) {
              itemPorPag.value = "50";
            }
          }

          const inputSelector = '[data-testid="job-search"]';
          await page.waitForSelector(inputSelector);
          await page.click(inputSelector);
          await page.type(inputSelector, query);
          await page.keyboard.press("Enter");
          const vagas = await page.evaluate(() => {
            const itens = Array.from(
              document.querySelectorAll('ul[data-testid="job-list__list"] > li')
            );

            return itens.map((li) => {
              const nomeVaga = li.querySelector(
                "div> div:nth-child(1)"
              )?.innerText;
              const modeloVaga = li.querySelector(
                "div> div:nth-child(2)"
              )?.innerText;
              const linkVaga = li.querySelector(
                'a[data-testid="job-list__listitem-href"]'
              )?.href;
              const data = new Date().toISOString();
              return { nomeVaga, linkVaga, modeloVaga, data };
            });
          });
          // delay(6);
          companyJobs.vagas.push(...vagas);
        } catch (err) {
          console.error(
            `Erro ao processar a URL ${url.link} da ${url.name}: ${err}`
          );
        }
      }

      newJobs.push(companyJobs);
    }
  } catch (err) {
    console.error(`Erro geral: ${err}`);
  } finally {
    await browser.close();

    const dir = path.dirname(new URL(import.meta.url).pathname);
    const filePath = path.join(dir, "../../data/jobResults.json");

    fs.readFile(filePath, (err, data) => {
      let existingJobs = err ? [] : JSON.parse(data.toString());

      for (let newJob of newJobs) {
        let existingCompany = existingJobs.find(
          (job) => job.empresa === newJob.empresa
        );
        if (existingCompany) {
          for (let newVaga of newJob.vagas) {
            let vagaExists = existingCompany.vagas.some(
              (vaga) =>
                vaga.nomeVaga === newVaga.nomeVaga &&
                vaga.linkVaga === newVaga.linkVaga
            );
            if (!vagaExists) {
              existingCompany.vagas.push(newVaga);
            }
          }
        } else {
          existingJobs.push(newJob);
        }
      }

      fs.writeFile(filePath, JSON.stringify(existingJobs, null, 2), (err) => {
        if (err) {
          console.error("Erro ao salvar o arquivo:", err);
        } else {
          console.log("Dados atualizados salvos em jobResults.json");
        }
      });
    });
  }
}
searchJobs();
export default searchJobs;
