import express from "express";
import cors from "cors";
import { readDataFromFile, saveDataToFile, verifyCredentials, stockage } from "./externalFunction.js";

const app = express();
const port = 3000;
const corsOptions = {
  origin: "http://127.0.0.1:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
};

let users = [];
let lastItemId = 0;

app.use(express.json());
app.use(cors(corsOptions));

app.use(async (req, res, next) => {
  try {
    users = await readDataFromFile();

    if (users.length > 0) {
      lastItemId = Math.max(...users.map((user) => user.id));
    }

    next();
  } catch (error) {
    next(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const newUser = req.body;

    // Récupérer la dernière valeur de l'ID depuis le fichier JSON
    const lastId = await getLastId();

    // Incrémenter la dernière valeur de l'ID
    const newId = lastId + 1;

    // Affecter le nouvel ID à l'utilisateur
    newUser.id = newId;

    // Sauvegarder l'utilisateur avec le nouvel ID
    await saveUser(newUser);

    res.json({ message: "Utilisateur ajouté avec succès", newUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur" });
  }
});

async function getLastId() {
  try {
    const users = await readDataFromFile();
    const lastId = Math.max(...users.map(user => user.id), 0);
    return lastId;
  } catch (error) {
    console.error("Erreur lors de la récupération du dernier ID.", error);
    throw error;
  }
}

async function saveUser(newUser) {
  try {
    const users = await readDataFromFile();
    users.push(newUser);
    await saveDataToFile(users);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'utilisateur.", error);
    throw error;
  }
}


app.post('/connexion', async (req, res) => {
  try {
    const { surname, password } = req.body;

    const user = await verifyCredentials(surname, password);

    if (user !== null) {
      res.status(200).json({ message: "Requête connectée", user });
    } else {
      res.status(401).json({ message: "Identifiants incorrects" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la vérification des identifiants" });
  }
});

app.post('/stockage', async (req, res) => {
  try {
    const newstock = req.body;
          newstock = JSON.stringify(newstock)
    console.log("req" + newstock);

    // Récupérer l'ID de l'utilisateur à partir du nouvel objet
    const idUser = newstock.idUser;
    console.log("l iduser" + idUser);

    // Récupérer la dernière valeur de l'ID pour l'objet depuis le fichier JSON
    const lastItemId = await getLastItemId("stock.json");

    // Incrémenter la dernière valeur de l'ID pour l'objet
    const newItemId = lastItemId + 1;

    // Assigner le nouvel ID et l'ID de l'utilisateur à l'objet
    newstock.id = newItemId;

    // Sauvegarder l'objet avec le nouvel ID et l'ID de l'utilisateur
    await stockage(newstock, idUser, "stock.json");

    res.status(200).json({ message: "Requête réussie", newstock });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du stockage" });
  }
});

async function getLastItemId(filename) {
  try {
    const data = await readDataFromFile(filename);
    const lastItemId = Math.max(...data.map(obj => obj.id), 0);
    return lastItemId;
  } catch (error) {
    console.error("Erreur lors de la récupération du dernier ID d'objet.", error);
    throw error;
  }
}


async function saveObjectWithUserId(newstock, idUser) {
  try {
    const data = await readDataFromFile();
    newstock.idUser = idUser;  // Assigne l'ID de l'utilisateur à l'objet
    data.push(newstock);
    await saveDataToFile(data);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'objet avec l'ID de l'utilisateur.", error);
    throw error;
  }
}


app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});
