import comptes from './comptes.js';
import express from 'express';
import fs from 'fs';

const tokens = {};
const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Route pour la création de compte
app.post('/creer-compte', (req, res) => {
  const { identifiant, password } = req.body;

  // Vérifiez si l'identifiant existe déjà
  if (comptes.hasOwnProperty(identifiant)) {
    console.error('Cet identifiant est déjà pris.');
    res.status(400).json({ message: 'Cet identifiant est déjà pris.' });
  } else {
    // Ajoutez le compte
    comptes[identifiant] = password;
    console.log('Compte ajouté : ', comptes);

    // Enregistrez les comptes dans le fichier
    enregistrerComptes(comptes);

    res.json({ message: 'Compte enregistré avec succès.' });
  }
});

function enregistrerComptes(comptes) {
  try {
    // Convertir l'objet comptes en chaîne JSON
    const comptesJSON = JSON.stringify(comptes, null, 2);

    // Écrire dans le fichier comptes.js
    fs.writeFileSync('./comptes.js', `const comptes = ${comptesJSON};\n\nexport default comptes;`, 'utf8');

    console.log('Comptes enregistrés avec succès dans le fichier comptes.js.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des comptes dans le fichier comptes.js :', error);
  }
}


app.post('/connexion', (req, res) => {
  const { identifiant, password } = req.body;
console.log(identifiant, password);
  if (comptes.hasOwnProperty(identifiant, password) && comptes[identifiant, password] === identifiant, password) {
    // Génération d'un token aléatoire
    const token = Math.random().toString(36).substring(7);
    
    // Stockage du token associé à l'identifiant et sa durée de validité (30 minutes)
    const validityDuration = 30 * 60 * 1000; // 30 minutes en millisecondes
    const expirationTime = Date.now() + validityDuration;
    tokens[identifiant] = { token, expirationTime };
    
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
  }
});




app.get('/consulter', (req, res) => {
  try {
    // Envoyer les comptes sous forme de tableau JSON
    res.json(comptes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la lecture des comptes.' });
  }
});





app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
