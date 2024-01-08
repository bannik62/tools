import express from 'express';
import { Socket } from 'net';
import cors from 'cors';
import portNames from './portNames.js';

console.log(portNames["80"]);  // Affiche "HTTP"

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Serveur en cours d\'exécution.');
});

app.get('/scan', (req, res) => {
  const host = req.query.host;
  const portsToScan = [];
  for (let i = 0; i <= 2080; i++) {
    portsToScan.push(i);
  }

  const openPorts = [];
  const portNamesForResponse = [];


  function scanPort(port) {
    const socket = new Socket();

    socket.setTimeout(5000);

    socket.on('connect', () => {
      console.log(`Port ${port} is open.`); // Affiche le port scanné quand il est ouvert

      openPorts.push(port);
      portNamesForResponse.push(portNames[port] || 'Unknown'); // Utilisation des noms de port depuis le fichier
      socket.destroy();
    });

    socket.on('error', (error) => {
      socket.destroy();
    });

    socket.on('timeout', () => {
      socket.destroy();
    });

    socket.connect({ host, port });
  }

  for (const port of portsToScan) {
    scanPort(port);
  }

  setTimeout(() => {
    res.json({ openPorts, portNames: portNamesForResponse });
  }, 3000);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
