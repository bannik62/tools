function sendRequest() {
    const ipAddress = document.getElementById('ipAddress').value;
    const url = `http://127.0.0.1:3000/scan?host=${ipAddress}`;
    let rep = document.getElementById('response');
  
    axios
      .get(url)
      .then((response) => {
        const responseData = response.data;
        const openPorts = responseData.openPorts;
        const portNames = responseData.portNames;
  
        // Créer une chaîne de réponse en parcourant les tableaux
        let responseString = '';
        for (let i = 0; i < openPorts.length; i++) {
          responseString += `${openPorts[i]} (${portNames[i]}), `;
        }
        // Supprimer la virgule en trop
        responseString = responseString.slice(0, -2);
  
        // Créer une nouvelle div pour chaque résultat
        const resultDivs = responseString.split(', ').map((result) => {
          const div = document.createElement('div');
   
          div.innerText = result;
  
          return div;
        });
  
        // Ajouter chaque div au conteneur
        for (const div of resultDivs) {
          div.style.border = "1px solid white"
          div.style.background = "black"
          div.style.color="white"
          rep.appendChild(div);
        }
      })
      .catch((error) => {
        rep.innerText = `Erreur : ${error.message}`;
      });
  }