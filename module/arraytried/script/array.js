let memos = [];
let index = 0;
let fileContent;  // Déclarez la variable en dehors des fonctions pour qu'elle soit accessible globalement

document.addEventListener("DOMContentLoaded", () => {
  // Récupération des mémos depuis le localStorage
  const savedMemos = JSON.parse(localStorage.getItem("memos")) || [];

  // Assurez-vous que votre variable globale "memos" est mise à jour
  memos = savedMemos;

  // Mettez à jour l'affichage des mémos
  displayMemos(savedMemos);
});

function displayMemos(memos) {
  const memoList = document.getElementById("memoList");

  memoList.innerHTML = "";

  memos.forEach((memo, index) => {
    // Création d'un élément div pour représenter la carte
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.style.margin = "15px 15px";
    cardDiv.style.paddingLeft = "10px";
    cardDiv.style.paddingRight = "10px";
    cardDiv.style.paddingTop = "10px";
    cardDiv.style.display = "flex";
    cardDiv.style.justifyContent = "center";
    cardDiv.style.alignItems = "center";
    cardDiv.style.borderRadius = "50px";
    cardDiv.style.maxHeight = "550px";
    cardDiv.style.minHeight = "100px";
    

    cardDiv.dataset.memoIndex = index++;

    const contentDiv = document.createElement("div");

    let text = document.createElement("p");
    text.classList.add("content-text");

    switch (memo.type) {
      case "string":
        cardDiv.style.backgroundColor = "#E04747";
        text.classList.add("content-text-string");

        contentDiv.classList.add("contentString");
        contentDiv.style.backgroundColor = "#F49898";
        console.log("Couleur changée à : ", contentDiv.style.backgroundColor);
        contentDiv.appendChild(text);
        text.innerHTML = `${memo.content.toString()}`;

        cardDiv.appendChild(contentDiv);
        break;

      case "number":
        cardDiv.style.backgroundColor = "#DF943D"; // Bleu clair
        text.classList.add("content-text-number"); // Ajout des classes spécifiques

        contentDiv.classList.add("contentNumber");
        contentDiv.style.backgroundColor = "#F1C592";
        console.log("Couleur changée à : ", contentDiv.style.backgroundColor);
        contentDiv.appendChild(text);
        text.innerHTML = `${memo.content.toString()}`;

        cardDiv.appendChild(contentDiv);
        break;

      case "object":
        cardDiv.style.backgroundColor = "#F55DD4"; // Violet clair
        text.classList.add("content-text-object");

        contentDiv.classList.add("contentObject");
        contentDiv.style.backgroundColor = "#F6B7E8";
        contentDiv.appendChild(text);
        text.innerHTML = `${memo.content.toString()}`;

        cardDiv.appendChild(contentDiv);
        break;

      case "function" || "functionArrow":
        cardDiv.style.backgroundColor = "#66DB3D"; // Saumon clair
        text.classList.add("content-text-function");

        contentDiv.classList.add("contentFunction");
        contentDiv.style.backgroundColor = "#A2F086";
        contentDiv.appendChild(text);
        text.innerHTML = `${memo.content.toString()}`;

        cardDiv.appendChild(contentDiv);
        break;

      case "variable":
        cardDiv.style.backgroundColor = "#19C152"; // Saumon clair
        text.classList.add("content-text-variable");

        contentDiv.classList.add("contentVariable");
        contentDiv.style.backgroundColor = "#A7DBB9";
        contentDiv.appendChild(text);
        text.innerHTML = `${memo.content.toString()}`;

        cardDiv.appendChild(contentDiv);
        break;

      case "phoneNumber":
        cardDiv.style.backgroundColor = "#21DBDB"; // Rouge tomate
        text.classList.add("content-text-phoneNumber");

        contentDiv.classList.add("contentPhone");
        contentDiv.style.backgroundColor = "#A7DBB9";
        contentDiv.appendChild(text);
        text.innerHTML = `${memo.content.toString()}`;

        cardDiv.appendChild(contentDiv);
        break;

      case "tableau":
        cardDiv.style.backgroundColor = "#5A60E8"; // Vert olive
        text.classList.add("content-text-tableau");

        contentDiv.style.backgroundColor = "#A7DBB9";

        break;

      case "url":
        cardDiv.style.backgroundColor = "#981EF8"; // Rose clair
        text.classList.add("content-text-url");

        contentDiv.classList.add("contentUrl");
        text.innerHTML = `<a href="${memo.content.toString()}">${memo.content.toString()}</a>`;

      default:
        cardDiv.style.backgroundColor = "#F55DD4"; // Blanc par défaut
    }

    // Création de l'élément de contenu
    contentDiv.appendChild(text);

    cardDiv.innerHTML = `
    <div class="head"><p>Type  : ${memo.type}</p></div>
      <h4 class="titre p-2">
        <p>Titre: ${memo.title}</p>
        </h4>
        
        `;
    // <p>Type  : ${memo.type}</p>
    const icoContenu = document.createElement("div");
    icoContenu.classList.add("icoContenu");
    icoContenu.style.marginBottom = "30px";
    const hr = document.createElement("hr");

    cardDiv.appendChild(icoContenu);
    icoContenu.after(hr);
    // Ajouter l'élément de contenu à la carte
    cardDiv.appendChild(contentDiv);

    // Ajouter un conteneur pour les boutons à l'intérieur de la carte

    // Ajouter un bouton de copie à la carte
    const copyButton = document.createElement("span");
    copyButton.classList.add("boutonCopier");
    copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
    copyButton.addEventListener("click", function () {
      copyMemoContent(memo);
    });
    icoContenu.appendChild(copyButton);

    // Ajouter un bouton de suppression à la carte
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("boutonDel");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.addEventListener("click", function () {
      deleteMemo(memo);
    });
    icoContenu.appendChild(deleteButton);

    const viewButton = document.createElement("span");
    viewButton.classList.add("boutonview");
    viewButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
    viewButton.addEventListener("click", () => {
      console.log("hello view ");
    });
    icoContenu.appendChild(viewButton);

   const joinButton = document.createElement("span");
joinButton.classList.add("boutonJoin");
joinButton.innerHTML = '<i class="fa-solid fa-paperclip"></i>';
joinButton.addEventListener("click", () => {
  // Ajoutez la logique pour télécharger le fichier joint
  downloadAttachment(memo.file);
});
icoContenu.appendChild(joinButton);
    // Ajouter la carte à la page
    memoList.insertBefore(cardDiv, memoList.firstChild);
  });
}

function downloadAttachment(file) {
  // Vérifiez d'abord si le fichier existe
  if (!file) {
    console.error("Aucun fichier joint trouvé.");
    return;
  }

  // Créez un objet Blob à partir du contenu du fichier
  const blob = new Blob([file], { type: file.type });

  // Créez un objet URL à partir du Blob
  const url = URL.createObjectURL(blob);

  // Créez un élément de lien pour le téléchargement
  const link = document.createElement("a");
  link.href = url;
  link.download = file; // Vous pouvez spécifier le nom du fichier ici
  link.click();

  // Libérez l'URL de l'objet Blob après le téléchargement
  URL.revokeObjectURL(url);
}

 
function openFileUploadDialog() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf, .jpg"; // Filtrez les fichiers autorisés par extension
  input.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  });

  // Cliquez sur le bouton d'upload de fichier
  input.click();
}

function handleFileUpload(selectedFile) {
  const reader = new FileReader();
  reader.onload = function (e) {
    fileContent = e.target.result; // Mettez à jour la variable globale
    console.log("Contenu du fichier:", fileContent); // Ajoutez cette ligne pour déboguer
    const title = document.getElementById("memoTitle").value;
    const content = document.getElementById("memoContent").value.trim().toLowerCase();
    let type;

    // Appeler la fonction addMemo avec le fichier joint
    addMemo(title, content, type);
  };
  reader.readAsDataURL(selectedFile);
}




// Fonction pour obtenir la date formatée
function getFormattedDate() {
  const date = new Date();
  return `Créé le ${date.toLocaleDateString()} à ${date.toLocaleTimeString()} `;
}

function deleteMemo(memo) {
  // Récupérer l'index du mémo dans le tableau
  const memoIndex = memos.indexOf(memo);

  // Vérifier si le mémo a été trouvé dans le tableau
  if (memoIndex !== -1) {
    // Supprimer le mémo du tableau
    memos.splice(memoIndex, 1);

    // Mettre à jour l'affichage
    displayMemos(memos);

    // Mettre à jour le Local Storage après la suppression
    updateLocalStorage();

    // Vous pouvez également afficher une notification ici si nécessaire
    showNotification("Mémo supprimé !");
  } else {
    console.error("Memo not found for deletion.");
    window.location.reload();
  }
}

// Fonction pour mettre à jour le Local Storage avec les mémos actuels
function updateLocalStorage() {
  localStorage.setItem("memos", JSON.stringify(memos));
}

function showNotification(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);

  // Retire la notification après 5 secondes
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 5000);
}

function copyMemoContent(memo) {
  const contentToCopy = memo.content;

  const textarea = document.createElement("textarea");
  textarea.value = contentToCopy;
  document.body.appendChild(textarea);

  textarea.select();
  textarea.setSelectionRange(0, 99999);

  try {
    navigator.clipboard.writeText(contentToCopy).then(() => {
      console.log("Contenu copié dans le presse-papiers :", contentToCopy);
      // Crée une bulle (toast) pour indiquer que le contenu a été copié
      const toast = document.createElement("div");
      toast.classList.add("toast");
      toast.textContent = "Contenu copié !";
      document.body.appendChild(toast);
      // Retire la bulle après 5 secondes
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 5000);
    });
  } catch (err) {
    console.error("Erreur lors de la copie dans le presse-papiers :", err);
  } finally {
    document.body.removeChild(textarea);
  }
}

// Appelez cette fonction pour ajouter les écouteurs d'événements
addEventListenersToFunctions();

function getFormattedDate() {
  const date = new Date();
  return `Créé le ${date.toLocaleDateString()} à ${date.toLocaleTimeString()} `;
}
function addMemo(title, content, type) {
  console.log("Ajout de mémo - Title:", title, "Content:", content, "Type:", type); // Ajoutez cette ligne pour déboguer
  const memoObject = { title, content, type };

  // Ajoutez le fichier joint uniquement s'il est présent
  if (fileContent) {
    memoObject.file = fileContent;
    fileContent = null; // Réinitialisez la variable globale après l'ajout
  }

  // Récupérer la liste existante depuis le localStorage ou une liste vide
  const savedMemos = JSON.parse(localStorage.getItem("memos")) || [];

  // Ajouter le nouveau mémo à la liste existante
  savedMemos.push(memoObject);

  // Sauvegarder la liste mise à jour dans le localStorage
  localStorage.setItem("memos", JSON.stringify(savedMemos));

  // Mettez à jour l'affichage des mémos
  displayMemos(savedMemos);
}



function searchAndDisplay() {
  const searchType = document.getElementById("searchType").value;
  const searchTerm = document.getElementById("searchTerm").value.toLowerCase();

  const filteredMemos = memos.filter((memo) => {
    const memoType = memo.type.toLowerCase();
    const memoContent = memo.content.toLowerCase();
    const memoTitle = memo.title.toLowerCase();

    const contentMatch = memoContent.includes(searchTerm);
    const titleMatch = memoTitle.includes(searchTerm);

    return (
      (searchType === "all" || memoType === searchType) &&
      (contentMatch || titleMatch)
    );
  });

  displayMemos(filteredMemos);
}
