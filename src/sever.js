import searchJobs from "./utils/searchJobs.js";

async function run() {
  try {
    const result = await searchJobs();
    console.log("Resultado da execução:", result);
  } catch (err) {
    console.error("Erro durante a execução da pipeline:", err);
  }
}

// Executa o processo
run();
