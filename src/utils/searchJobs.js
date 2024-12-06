import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { urlList } from "../../link.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function searchJobs() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "/tmp/myChromeSession",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const newJobs = [];
  try {
    const page = await browser.newPage();
    const ListSearch = [
      // "front",
      // "back",
      // "fullstack",
      // "devops",
      // "mobile",
      "junior",
      // "java",
      "jr",
    ];

    // for (const url of urlList) {
    for (const url of urlListTest) {
      const companyJobs = { empresa: url.name, vagas: [] };
      for (const query of ListSearch) {
        try {
          await page.goto(url.link, { waitUntil: "networkidle0" });
          const amount = await page.evaluate(() => {
            const amount = document.querySelector(
              "p[data-testid=\"job-list-amount\"]",
            )?.innerText;
            return amount;
          });
          if (amount > 10) {
            console.log("amount: ", amount);
            const itemPorPag = document.querySelector(
              "input[name=\"items-por-pagina\"]",
            );
            if (itemPorPag) {
              itemPorPag.value = "50";
            }
          }

          const inputSelector = "[data-testid=\"job-search\"]";
          await page.waitForSelector(inputSelector);
          await page.click(inputSelector);
          await page.type(inputSelector, query);
          await page.keyboard.press("Enter");
          const vagas = await page.evaluate(() => {
            const itens = Array.from(
              document.querySelectorAll("ul[data-testid=\"job-list__list\"] > li"),
            );

            return itens.map((li) => {
              const nomeVaga = li.querySelector(
                "div> div:nth-child(1)",
              )?.innerText;
              const modeloVaga = li.querySelector(
                "div> div:nth-child(2)",
              )?.innerText;
              const linkVaga = li.querySelector(
                "a[data-testid=\"job-list__listitem-href\"]",
              )?.href;
              const data = new Date().toISOString();
              return {
                nomeVaga, linkVaga, modeloVaga, data,
              };
            });
          });
          delay(6);
          companyJobs.vagas.push(...vagas);
        } catch (err) {
          console.error(
            `Erro ao processar a URL ${url.link} da ${url.name}: ${err}`,
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
    const dataDir = path.join(dir, "../../data"); // Definindo dataDir aqui
    const filePath = path.join(dataDir, "jobResults.json");

    // Verifica se a pasta 'data' existe, se não, cria a pasta
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Verifica se o arquivo 'jobResults.json' existe, se não, cria o arquivo com um array vazio
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }

    fs.readFile(filePath, (err, data) => {
      let existingJobs;
      try {
        existingJobs = JSON.parse(data.toString());
        if (!Array.isArray(existingJobs)) {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        existingJobs = [];
      }

      for (const newJob of newJobs) {
        const existingCompany = existingJobs.find(
          (job) => job.empresa === newJob.empresa,
        );
        if (existingCompany) {
          for (const newVaga of newJob.vagas) {
            const vagaExists = existingCompany.vagas.some(
              (vaga) => vaga.nomeVaga === newVaga.nomeVaga
                && vaga.linkVaga === newVaga.linkVaga,
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
