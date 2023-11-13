import express from 'express';
// eslint-disable-next-line import/extensions
import getFirstList from './utils/firstList.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/get-list', async (req, res) => {
  const response = await getFirstList();

  res.send(response);
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
// export default app;
