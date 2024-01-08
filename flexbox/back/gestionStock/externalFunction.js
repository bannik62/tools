import fs from "fs/promises";

const dataFilePath = "./users.json"; // Remplacez par votre chemin correct
const stockagePath = "./stock.json";

async function readDataFromFile() {
  try {
    const jsonData = await fs.readFile(dataFilePath, "utf8");
    const parsedData = JSON.parse(jsonData);
    return parsedData;
  } catch (error) {
    console.error("Erreur lors de la lecture des données depuis le fichier.", error);
    throw error;
  }
}

async function saveDataToFile(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data));
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données dans le fichier.", error);
    throw error;
  }
}

async function verifyCredentials(surname, password) {
  try {
    const users = await readDataFromFile();

    // Recherche de l'utilisateur par le nom de famille (surname)
    const user = users.find(user => user.surname === surname);

    if (user && user.pass === password) {
      // Supprime le champ "pass" du retour
      delete user.pass;
      return user; // Mot de passe correct
    } else {
      return null; // L'utilisateur n'existe pas ou le mot de passe est incorrect
    }
  } catch (error) {
    console.error("Erreur lors de la vérification des identifiants.", error);
    throw error;
  }
}

async function stockage(newstock) {
  try {
    const lectureStock = await fs.readFile(stockagePath, "utf8");
    let data = JSON.parse(lectureStock);
    let lastItemId = 0;

    if (data.length > 0) {
      lastItemId = Math.max(...data.map((obj) => obj.id));
    }

    newstock.id = lastItemId + 1;
    data.push(newstock);
    await fs.writeFile(stockagePath, JSON.stringify(data));
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données dans le fichier.", error);
    throw error;
  }
}

export { readDataFromFile, saveDataToFile, verifyCredentials, stockage };

