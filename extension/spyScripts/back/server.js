import express from 'express';
import OpenAI from 'openai';
import bodyParser from 'body-parser';
import cors from 'cors'; // Importez le module cors


const app = express();
const openai = new OpenAI({ apiKey: "" });
const corsOptions = {
    origin: 'http://127.0.0.1:3000', // Remplacez ceci par l'origine réelle de votre frontend
    methods: 'POST',
    optionsSuccessStatus: 204,
  };
app.use(bodyParser.json());
app.use(cors(corsOptions));


app.use(async (req, res, next) => {
  try {
    console.log('Requête reçue :', req.body);

    let textInput = req.body.text;
    let words = textInput.split(' ');
    let chunks = [];

    for (let i = 0; i < words.length; i += 1000) {
      chunks.push(words.slice(i, i + 1000).join(' '));
    }

    req.chunks = chunks;
    console.log('Chunks calculés :', chunks);

    next();
  } catch (error) {
    console.error('Erreur dans le middleware de découpage en chunks :', error);
    next(error);
  }
});

app.post('/api/analyse', async (req, res) => {
  let chunks = req.chunks;
  console.log(chunks);
  let responses = [];
  console.log(responses);

  try {
    for (let i = 0; i < chunks.length; i++) {
      let isFirst = i === 0;
      let isLast = i === chunks.length - 1;

      let messages = [
        { "role": "system", "content": "Vous discutez avec un expert en JavaScript." },
        { "role": "system", "content": isFirst ? "Premier message" : (isLast ? "Dernier message" : "Message intermédiaire") },
        { "role": "user", "content": chunks[i] }
      ];

      const chatResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages
      });

      let responseContent = chatResponse.data.choices[0].message.content;
      console.log('Réponse calculée pour chunk', i, ':', responseContent);

      responses.push(responseContent);
    }

    console.log('Réponses finales envoyées :', responses);
    res.send(responses);
  } catch (error) {
    console.error('Erreur dans la gestion de la requête /api/analyse :', error);
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur écoute sur le port ${port}...`);
});
