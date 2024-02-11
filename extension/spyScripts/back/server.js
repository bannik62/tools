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
        pass: "",
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
          {
            role: "system",
            content: "tu es un expert en JavaScript est protocole réseaux ",
          },
          {
            role: "user",
            content: `analyse ce script, puis dit moi son utilité , en dernier mot tu ajoutes pour synthése un #tag entouré d'une balise <strong> qui défini le script , exemples de tags: [tracking telemetrie ,sécurité ,suivi de bug,malveillant, publicitaire,cosmetique ,autre].(utilise des balises <br>pour les saurt de ligne et les autre attributs html utile pour la mise en page du texte  n'utilise pas des \\n svp) : ${chunk} `,
          },
        ],
      });
      responses.push(completion.choices[0].message.content);

      await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
      sendEmail();
    }

    console.log("Réponses de l'API OpenAI :", responses);
    function sendEmail() {
      const mailOptions = {
        from: "smtp62cent@gmail.com",
        to: userEmail,
        subject: "Analyse du script",
        text: `Réponses de l'API OpenAI : ${responses.join("\n")}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erreur lors de l'envoi de l'e-mail :", error);
        } else {
          console.log("E-mail envoyé avec succès :", info.response);
        }
      });
    }
    res.json({ message: "Success", responseData: responses });
  } catch (error) {
    console.error("Erreur dans la gestion de la requête /api/analyse :", error);
    res.status(500).send(error.message);
  }
});

const apiKeyRegex = /^sk-[A-Za-z0-9]{24}$/; // Regex pour les clés API Secret OpenAI
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/; // Regex pour les adresses e-mail

app.post("/api/saveCredentials", (req, res) => {
  const { email, apiKey } = req.body;

  // Valider les données avec les regex
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (!apiKeyRegex.test(apiKey)) {
    return res.status(400).json({ error: "Invalid API key format." });
  }

  // Si les données sont valides, les enregistrer
  userEmail = email;
  userApiKey = apiKey;
  res.json({ message: "Credentials saved successfully." });
});

app.get("/api/checkApiKey", (req, res) => {
  try {
    if (userApiKey) {
      res.json({ keyLoaded: true });
    } else {
      res.json({ keyLoaded: false });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la clé API :", error);
    res.status(500).send(error.message);
  }
});

// Route pour vider la clé API OpenAI
app.delete("/api/deleteApiKey", (req, res) => {
  try {
    userEmail = ""; // Vide l'email
    userApiKey = ""; // Vide la clé API
    res.json({ message: "Clé API supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la clé API :", error);
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur écoute sur le port ${port}...`);
});
