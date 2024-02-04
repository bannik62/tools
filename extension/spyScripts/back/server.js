import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import fetch from "node-fetch";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: "**",
});

const app = express();
const corsOptions = {
  origin: "http://127.0.0.1:3000", 
  methods: ["POST", "GET"],
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cors(corsOptions));


app.post("/api/analyse", async (req, res) => {
  try {
    console.log("Requête reçue :", req.body);

    const scriptUrl = req.body.text;
    console.log("scripturl " + scriptUrl);

    const scriptResponse = await fetch(scriptUrl);

    if (!scriptResponse.ok) {
      throw new Error(
        `Erreur lors du téléchargement du script : ${scriptResponse.statusText}`
      );
    }

    const scriptContent = await scriptResponse.text();
    console.log("Script téléchargé :", scriptContent);

    // Fonction pour diviser le script en morceaux de 3000 mots (tokens)
    function chunkScript(scriptContent, chunkSize) {
      const words = scriptContent.split(/\s+/); // Diviser le script par espaces
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

    const chunkSize = 3000; // Nombre maximal de mots (tokens) par morceau
    const scriptChunks = chunkScript(scriptContent, chunkSize);
    const responses = [];
    const delayBetweenRequests = 20000; // Délai entre les requêtes en millisecondes

    for (const chunk of scriptChunks) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "tu es un expert en JavaScript" },
          { role: "user", content: "analyse ce script et dit moi son utilité et en dernier mot tu ajoutes un tag pour le definir, les tag: tracking telemetrie ,sécurité ,suivi de bug,malveillant, publicitaire,cosmetique ,autre :" + chunk },
        ],
      });
      responses.push(completion.choices[0].message.content);

      // Ajoute le délai entre les requêtes
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }

    console.log("Réponses de l'API OpenAI :", responses);

    // Envoyer l'e-mail avec les réponses
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "smtp62cent@gmail.com", // Remplacez par votre adresse e-mail Gmail
        pass: "**"
    }});

    const mailOptions = {
      from: "smtp62cent@gmail.com",
      to: "djbk62@gmail.com", // Remplacez par l'adresse e-mail du destinataire
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
