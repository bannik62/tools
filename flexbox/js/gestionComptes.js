async function creerCompte() {
  const identifiant = document.getElementById("identifiant").value;
  const password = document.getElementById("password").value;
  const port = "3000";
  console.log("Identifiant:", identifiant);
  console.log("Mot de passe:", password);

  if (!identifiant || !password) {
    alert("Veuillez entrer un identifiant et un mot de passe.");
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:${port}/creer-compte`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifiant, password }),
    });
    console.log(
      "Corps de la requête:",
      JSON.stringify({ identifiant, password })
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    console.error("Error:", error);
    alert("Une erreur s'est produite lors de la création du compte.");
  }
}

async function connexion() {
  const identifiant = document.getElementById("identifiant").value;
  const password = document.getElementById("password").value;
  const port = "3000";

  const storeToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  const storeIdentifiant = (identifiant) => {
    localStorage.setItem('identifiant', identifiant);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  if (!identifiant || !password) {
    alert("Veuillez entrer un identifiant et un mot de passe.");
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:${port}/connexion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifiant, password }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    const storedToken = getToken();

    if (storedToken) {
      alert("Vous êtes déjà connecté!");
    } else if (result.success) {
      storeToken(result.token);
      storeIdentifiant(identifiant);
      alert("Connexion réussie.");
      green()
      hiddenDiv()
      window.location.reload();
    } else {
      alert("Identifiants incorrects.");
      window.location.reload();
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Une erreur s'est produite.");
    window.location.reload();
  }
}

function deconnexion() {
  localStorage.removeItem('token');
  localStorage.removeItem('identifiant');
  console.log('LocalStorage vidé.');
  alert('Vous avez été déconnecté.');
  green()
  hiddenDiv()
  window.location.reload();
}

function hiddenDiv() {
  const getNom = () => {return localStorage.getItem('identifiant');};
  const getToken = () => {return localStorage.getItem('token');};

  const lienDiv = document.querySelector(".lienDiv");
  const token = getToken();
  const nom = getNom();

  if (token) {
    lienDiv.style.display = 'block';
    lienDiv.style = 'border:2px solid black';
    lienDiv.innerHTML = `<h3>Bienvenue ${nom}</h3>`;
    lienDiv.innerHTML += `<button onclick="afficherComptes()">Afficher les comptes</button>`;
  } else {
    lienDiv.style.display = 'none';
    lienDiv.style = 'border : 0 '
    lienDiv.innerHTML = '';
  }
}

hiddenDiv();

function green(param) { 
  const token = localStorage.getItem('token');
  const divgreen = document.querySelector(".autenti");

  divgreen.style.backgroundColor = token ? 'green' : 'red';
}
green();

async function afficherComptes() {
  const popup = window.open('', 'Popup', 'width=600,height=400');
  const port = "3000";

  try {
    // Faites une requête pour obtenir le contenu des comptes
    const response = await fetch(`http://127.0.0.1:${port}/consulter`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des comptes : ' + response.statusText);
    }

    const comptesData = await response.json();
    const comptesArray = Object.entries(comptesData[0]).map(([identifiant, password]) => ({ identifiant, password }));

    const tableHtml = `
      <table border="1">
      <h1>bienvue dans la liste des inscrits </h1>
        <tr>
          <th>Identifiant</th>
          <th>Password</th>
        </tr>
        ${comptesArray.map(compte => `
          <tr>
            <td>${compte.identifiant}</td>
            <td>${compte.password}</td>
          </tr>
        `).join('')}
      </table>
    `;
    popup.document.write(tableHtml);  // Utilisez document.write pour écrire dans la popup
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes :', error);
  }
}


// Vous pouvez appeler cette fonction lors de l'initialisation de la page ou au moment approprié





