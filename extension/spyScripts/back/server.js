import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: "",
});

const app = express();
const corsOptions = {
  origin: "http://127.0.0.1:3000", // Remplacez ceci par l'origine réelle de votre frontend
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

    async function main(scriptContent) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "tu es un expert en JavaScript" },
          { role: "user", content: "analyse ce script et dit moi sont utilité :" + scriptContent },
        ],
      });

      console.log(completion.choices[0]);
    }

    main(scriptContent);
    console.log("Réponse de l'API OpenAI :", responseContent);

    res.json({ message: "Success", responseData: responseContent });
  } catch (error) {
    console.error("Erreur dans la gestion de la requête /api/analyse :", error);

    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur écoute sur le port ${port}...`);
});
