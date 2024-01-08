
function interfaceStock() {
  let stocko = document.querySelectorAll(".stocko");
  for (let element of stocko) {
    element.style.display = "block";
    bvn();
    
    function bvn() {
  const user = localStorage.getItem("user");
  const bienvenue = document.getElementById("bienvenue");
  bienvenue.innerText = `Bienvenue ${JSON.parse(user).surname}`;
  bienvenue.classList = `text-center text-lg p-5`;
  
}


    element.innerHTML = ` 
    <form id="envoistock" onsubmit="envoistock(event)">
    <label for="categorie">Choisissez une categorie:</label>
    <select name="categorie" id="categorie">
     <option value="alimentation">Alimentation</option>
     <option value="electronique">Electronique</option>
     <option value="jardinage">Jardinage</option>
   </select>
   <label for="nameObject">Nom de l'objet</label>
   <input type="text" name="nameObject" id="nameObject" require>
   <label for="number">Nombre d'objet</label>
   <input type="number" name="number" id="number" require >
   <div>
   <label for="description">Desciption de l'objet</label>
   <input type="" name="description" id="description" class="ms-3 require">
   <label for="envois"></label>
   <input type="submit" name="envois" value="envois">
   </form>
   <div><button class="btn btn-dark" onclick="clear()">deconnexion</button>
   <script>
   <div>
   <button class="btn btn-dark" onclick="clearLocalStorage()">Déconnexion</button>
   <script>
     function clearLocalStorage() {
       console.log("Fonction lancée");
       
       if (localStorage.length > 0) {
         localStorage.clear();
         console.log("Local storage vidé");
         window.location.reload();

       } else {
         console.log("Local storage est déjà vide");
       }
 
       window.location.reload();
     }
   </script>
 </div>
 
   </div>`;
  }
}

async function inscription(event) {
  console.log("Fonction inscription appelée");
  event.preventDefault();

  const surname = document.getElementById("surnamei").value;
  const firstName = document.getElementById("firstNamei").value;
  const lastName = document.getElementById("lastNamei").value;
  const email = document.getElementById("emaili").value;
  const pass = document.getElementById("passi").value;
  const id = "";
  const role = "";
  console.log(surname, firstName, lastName, email, role, pass);
  try {
    const utilis = { id, surname, firstName, lastName, email, role, pass };

    const response = await axios.post("http://127.0.0.1:3000/register", utilis);
    // function verifLocal() {
    //   const local = localStorage.getItem("user");
    //   console.log(local);
    //   local = JSON.parse(local);
    //   if (local !== true) {
    //     localStorage.removeItem("user");
    //     window.location.reload();
    //   } else {
    //     console.log("User registered successfully:", response.data);
    //   }
    // }
    // verifLocal();
  } catch (error) {
    console.error("Error during registration:", error.response.data);
    console.error("stack: ", error.stack);
    console.error("stack: ", error.name);
    console.log("requete", error.request);
  }
}

async function envoistock(e) {
  e.preventDefault();

  // Récupérez l'ID de l'utilisateur depuis le localStorage
   let user = localStorage.getItem("user")
   console.log("l user :" + user);
   user = JSON.parse(localStorage.getItem(user));
  const userId = user ? user.id : null;
  console.log("l userid" + userId);

  // Récupérez les valeurs des champs du formulaire
  const categorie = document.getElementById("categorie").value;
  const nameObject = document.getElementById("nameObject").value;
  const number = document.getElementById("number").value;
  const description = document.getElementById("description").value;

  // Créez un objet contenant les données à envoyer au serveur
  const dataStock = {
    categorie,
    nameObject,
    number,
    description,
    userId  // Ajoutez l'ID de l'utilisateur ici
  };

  try {
    const response = await axios.post(
      "http://127.0.0.1:3000/stockage",
      dataStock
    );

    // Traitez la réponse du serveur si nécessaire
    console.log("Réponse du serveur :", response.data);

    // Effectuez les actions appropriées en fonction de la réponse du serveur

  } catch (error) {
    console.error("Erreur lors de l'envoi des données au serveur :", error);
  }
}


async function connexion(event) {
  event.preventDefault();
  try {
    const surname = document.getElementById("surname").value;
    const password = document.getElementById("pass").value;
    const utilis = { surname, password };
    const response = await axios.post(
      "http://127.0.0.1:3000/connexion",
      utilis
    );

    if (response.status === 200) {
      console.log("User registered successfully:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setTimeout(function () {
        document.getElementById("closer").click();
      }, 1000);
      interfaceStock();
    } else{
      function verifLocal() {
        const local = localStorage.getItem("user");
        console.log("local:" + local);
        local = JSON.parse(local);
        if (local == null || local === "") {
          localStorage.removeItem("user");
          window.location.reload();
          console.log("User unregistered ", response.data);
          alert("identifiant ou mot de passe erroné");
        }
      }
      verifLocal();
    }
  } catch (error) {
    console.error("Error during registration:", error.response.data);
    console.error("stack: ", error.stack);
    console.error("stack: ", error.name);
    console.log("requete", error.request);
  }
}
window.onload = function () {
  console.log(localStorage.getItem("user"));
  if (localStorage.getItem("user") !== null) {
    interfaceStock(); // Appeler seulement si l'utilisateur est connecté
  }
};
