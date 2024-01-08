import axios from "axios";

let contacts = [];  // Définir contacts dans une portée plus élevée

async function refresh() {
  const url = "http://127.0.0.1:3000/data/see";

  try {
    const response = await axios.get(url);
    const agendaBody = document.getElementById("agendaBody");

    // Vérifier si la réponse a des données
    if (response.data && response.data.contacts) {
      contacts = response.data.contacts;  // Mettre à jour la variable contacts

      // Utiliser map pour créer une nouvelle structure avec les données
      const tableRows = contacts.map(contact => {
        return `
          <tr>
            <td>${contact.id}</td>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td><button type="button" id="delete-${contact.id}" class="btn btn-primary m-3">Supprimer</button></td>
          </tr>
        `;
      }).join("");

      // Joindre les lignes et les ajouter au corps du tableau
      agendaBody.innerHTML = tableRows;

      // Ajouter un gestionnaire d'événements pour chaque bouton "Supprimer"
      contacts.forEach(contact => {
        const deleteButton = document.getElementById(`delete-${contact.id}`);
        deleteButton.addEventListener("click", () => deleteContact(contact.id));
      });

    } else {
      console.error("Réponse invalide ou sans données.");
    }
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
  }
}

// Fonction pour supprimer un contact
async function deleteContact(id) {
  const file = "crudData.json";
  try {
    const response = await axios.delete(`http://127.0.0.1:3000/data/${id}`);
    console.log("Contact supprimé avec succès :", response.data);
    refresh();  // Rafraîchir l'affichage après la suppression
  } catch (error) {
    console.error("Erreur lors de la suppression du contact :", error);
  }
}

document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le rechargement de la page

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  const contactForm = {
    name: name,
    email: email,
    phone: phone
  };

  // Envoyer les données via Axios
  axios
    .post("http://127.0.0.1:3000/data", contactForm)
    .then((response) => {
      console.log("Réponse de la requête :", response.data);
    })
    .catch((error) => {
      console.error("Erreur lors de la requête :", error);
    });
    window.location.reload()});

// Appeler la fonction refresh pour peupler les contacts initialement
// refresh();
