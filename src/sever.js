import express from "express";
import getFirstList from "./utils/firstList.js";
import searchJobs from "./utils/searchJobs.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/get-list", async (req, res) => {
  const response = await getFirstList();

  res.send(response);
});

app.get("/test/:searchQuery", async (req, res) => {
  const { searchQuery } = req.params;
  const response = await searchJobs(searchQuery);

  res.send(response);
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
