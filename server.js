import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/quote', async (req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al obtener la cita');
  }
});

app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const translateResponse = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text'
      })
    });

    if (!translateResponse.ok) {
      throw new Error(`HTTP error! status: ${translateResponse.status}`);
    }

    const translationData = await translateResponse.json();
    res.send(translationData);
  } catch (error) {
    console.error('Error calling the translation API:', error);
    res.status(500).send('Error al traducir el texto');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
