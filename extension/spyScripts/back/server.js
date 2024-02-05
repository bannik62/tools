import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import fetch from "node-fetch";
import OpenAI from "openai";

const app = express();
const corsOptions = {
  origin: "http://127.0.0.1:3000",
  methods: ["POST", "GET"],
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cors(corsOptions));

let userEmail = "";
let userApiKey = "";

app.post("/api/saveCredentials", (req, res) => {
  const { email, apiKey } = req.body;
  userEmail = email;
  userApiKey = apiKey;
  res.json({ message: 'Credentials saved successfully.' });
});

app.post("/api/analyse", async (req, res) => {
  try {
    console.log("Requête reçue :", req.body);
    const scriptUrl = req.body.text;
    console.log("scripturl " + scriptUrl);

    const openai = new OpenAI({
      apiKey: userApiKey,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "smtp62cent@gmail.com",
        pass: "*",
      },
    });

    const scriptResponse = await fetch(scriptUrl);

    if (!scriptResponse.ok) {
      throw new Error(
        `Erreur lors du téléchargement du script : ${scriptResponse.statusText}`
      );
    }

    const scriptContent = await scriptResponse.text();
    console.log("Script téléchargé :", scriptContent);

    function chunkScript(scriptContent, chunkSize) {
      const words = scriptContent.split(/\s+/);
      const chunks = [];
      let currentChunk = "";

      for (const word of words) {
        if ((currentChunk + word).length <= chunkSize) {
          currentChunk += `${word} `;
        } else {
          chunks.push(currentChunk.trim());
          currentChunk = `${word} `;
        }
      }

      if (currentChunk.trim() !== "") {
        chunks.push(currentChunk.trim());
      }

      return chunks;
    }

    const chunkSize = 3000;
    const scriptChunks = chunkScript(scriptContent, chunkSize);
    const responses = [];
    const delayBetweenRequests = 20000;

    for (const chunk of scriptChunks) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "tu es un expert en JavaScript" },
          { role: "user", content: "analyse ce script et dit moi son utilité et en dernier mot tu ajoutes un tag pour le definir, les tag: tracking telemetrie ,sécurité ,suivi de bug,malveillant, publicitaire,cosmetique ,autre :" + chunk },
        ],
      });
      responses.push(completion.choices[0].message.content);

      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }

    console.log("Réponses de l'API OpenAI :", responses);

    const mailOptions = {
      from: "smtp62cent@gmail.com",
      to: userEmail,
      subject: "Analyse du script",
      text: `Réponses de l'API OpenAI : ${responses.join('\n')}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
      } else {
        console.log("E-mail envoyé avec succès :", info.response);
      }
    });

    res.json({ message: "Success", responseData: responses });

  } catch (error) {
    console.error("Erreur dans la gestion de la requête /api/analyse :", error);
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur écoute sur le port ${port}...`);
});
