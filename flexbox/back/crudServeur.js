import express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://127.0.0.1:5173",
  methods: "POST,GET, DELETE", // pas d'espace après la virgule
  allowedHeaders: "Content-Type,Authorization ",
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true })); // Middleware pour traiter les données urlencodées
app.use(express.json());

// Fonction pour obtenir le prochain ID en incrémentant le dernier ID

app.get("/data/see", (req, res) => {
  try {
    // Lire les données depuis le fichier
    const data = fs.readFileSync("./crudData.json");
    const dataJson = JSON.parse(data);

    // Envoyer les données en réponse
    res.json(dataJson);
  } catch (error) {
    console.log("Erreur lors de la lecture des données :", error.message);
    res.status(500).send("Erreur lors de la lecture des données.");
  }
});

  const getNextId = () => {
  // Charger les données existantes depuis le fichier
  const existingData = fs.readFileSync("./crudData.json");
  const dataJson = JSON.parse(existingData);

  let maxId = -Infinity;

  for (const contact of dataJson.contacts) {
    if (contact.id > maxId) {
      maxId = contact.id;
    }
  }

  console.log('Le plus grand id est :', maxId);
  return maxId + 1; // Retourner le prochain ID
};

app.post("/data", (req, res) => {
  try {
    const newContact = req.body;
    console.log("error :" + newContact);
    newContact.id = getNextId(); // Obtenir le nouvel ID

    // Charger les données existantes depuis le fichier
    let existingData = fs.readFileSync("./crudData.json");

    const dataJson = JSON.parse(existingData);
    console.log(dataJson);

    // Ajouter le nouveau contact aux données existantes
    dataJson.contacts.push(newContact);

    // Écrire les données mises à jour dans le fichier
    fs.writeFileSync("./crudData.json", JSON.stringify(dataJson));

    res.send("Contact ajouté avec succès.");
  } catch (error) {
    console.log("les erreur :" + error.message);
    res.status(500).send(error);
  }
});

app.delete("/data/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);  // Récupérer l'ID depuis les paramètres de l'URL

    let existingData = fs.readFileSync("./crudData.json");
    let dataJson = JSON.parse(existingData);

    // Filtrer les contacts et conserver ceux qui ont un ID différent de celui spécifié
    dataJson.contacts = dataJson.contacts.filter(contact => contact.id !== id);
    console.log("data" + dataJson.contacts)

    // Écrire les données mises à jour dans le fichier JSON
    fs.writeFileSync("./crudData.json", JSON.stringify(dataJson, null, 2));

    res.send("Contact supprimé avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression du contact :", error);
    res.status(500).send("Erreur lors de la suppression du contact.");
  }
});




app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});
