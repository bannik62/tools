document.addEventListener("DOMContentLoaded", function () {
  chrome.windows.getLastFocused({ populate: true }, function (currentWindow) {
    chrome.tabs.query(
      { active: true, windowId: currentWindow.id },
      function (activeTabs) {
        const activeTab = activeTabs[0];
        const tabUrl = activeTab.url;

        if (tabUrl.startsWith("https:") || tabUrl.startsWith(".js")) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "getScripts" },
            function (response) {
              if (response && response.scripts) {
                const scriptTable = document.getElementById("scriptTable");
                response.scripts.forEach(function (scriptUrl) {
                  const row = document.createElement("tr");

                  const tdSrc = document.createElement("td");
                  tdSrc.textContent = scriptUrl;
                  row.appendChild(tdSrc);

                  const tdSize = document.createElement("td");
                  row.appendChild(tdSize);

                  const tdDownload = document.createElement("td");
                  tdDownload.classList.add("tdDownload")
                  const downloadBtn = document.createElement("button");
                  let analyseBtn = document.createElement("button");
                  analyseBtn.setAttribute('disabled', true);
                  analyseBtn.classList.add("disable")


                  downloadBtn.textContent = "Télécharger";
                  downloadBtn.addEventListener("click", function () {
                    chrome.downloads.download({ url: scriptUrl });
                  });

                  analyseBtn.textContent = "Analyser";
                  analyseBtn.addEventListener("click", async () => {
                    // Affiche une fenêtre de chargement
                    window.alert(
                      "Ne fermez pas la fenetre de l'extensions l'analyse peut prendre un temps conséquent ,  un email vous sera envoyer "
                    );
                    const apiKeyStatus = document.getElementById('apiKeyStatus');
                    apiKeyStatus.textContent = 'Analyse en cours ne supprimé pas vos informations';

                    try {
                      // Envoie le script pour analyse au serveur
                      sendScriptForAnalysis(scriptUrl);
                    } catch (error) {
                      // En cas d'erreur, affiche un message d'erreur dans la fenêtre de chargement
                      loadingWindow.document.body.innerHTML =
                        "Erreur : " + error.message;
                      console.error(error);
                    }
                  });

                  function sendScriptForAnalysis(scriptContent) {
                    const apiUrl = "http://127.0.0.1:3000/api/analyse"; // Remplacez cela par l'URL de votre backend
                    console.log("script " + scriptContent);

                    fetch(apiUrl, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ text: scriptContent }), // Utilisez la clé 'text'
                    })
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error(
                            `Réponse non OK: ${response.statusText}`
                          );
                        }
                        return response.json();
                      })
                      .then(async (data) => {
                        console.log("Réponse du backend :", data);

                        if (data) {
                          const popupWidth = "auto";
                          const popupHeight = 300;
                          const loadingWindow = window.open(
                            "",
                            "_blank",
                            `width=${popupWidth},height=${popupHeight}`
                          );
                          loadingWindow;
                          const style = loadingWindow.document.createElement("style")
                          style.innerHTML =`p{font-size: 1rem } .display{padding:15px;border:solid 2px black;}` 
                          const resultElement = loadingWindow.document.createElement("div");
                          resultElement.classList.add("display")
                          const analyse = loadingWindow.document.createElement("p")
                          
                          loadingWindow.document.head.appendChild(
                            style
                          )
                          loadingWindow.document.body.appendChild(
                            resultElement
                          );
                          resultElement.appendChild(
                            analyse
                          ) ;
                          analyse.innerText = `Résultats de l'analyse  : ${JSON.stringify(
                            data
                          )}`;
                        } else {
                          loadingWindow.document.body.innerHTML =
                            "Aucune réponse reçue.";
                        }
                      })
                      .catch((error) => {
                        console.error(
                          "Erreur lors de l'envoi du script au front:",
                          error
                        );
                      });
                  }

                  tdDownload.appendChild(downloadBtn);
                  tdDownload.appendChild(analyseBtn); 
                  row.appendChild(tdDownload);

                  scriptTable.appendChild(row);

                  getScriptSize(scriptUrl, function (size) {
                    tdSize.textContent = formatFileSize(size);
                  });
                });

                // Sélectionnez tous les boutons avec la classe "disable"
                let analyseBtns = document.querySelectorAll(".disable");

                // Parcourez chaque bouton et ajoutez un écouteur d'événement "input" à chaque champ d'entrée
                analyseBtns.forEach(function (analyseBtn) {
                  apiKeyInput.addEventListener('input', function () {
                    // Vérifiez si l'entrée est vide ou non
                    if (apiKeyInput.value.trim() !== '') {
                      // Si oui, enlevez l'attribut "disabled" du bouton actuel
                      analyseBtn.removeAttribute('disabled');
                    } else {
                      // Sinon, ajoutez l'attribut "disabled" au bouton actuel
                      analyseBtn.setAttribute('disabled', true);
                    }
                  });
                });
              } else {
                console.error(
                  "Erreur : aucune réponse ou la liste des scripts n'a pas été récupérée."
                );
              }
            }
          );
        } else {
          console.error("Erreur : L'URL ne correspond pas au modèle souhaité.");
        }
      }
    );
  });
});

function getScriptSize(url, callback) {
  fetch(url, { method: "HEAD" })
    .then((response) => {
      const size = response.headers.get("content-length");
      console.log("length " + size);
      callback(parseInt(size, 10));
    })
    .catch((error) => {
      callback(0);
    });
}

function formatFileSize(size) {
  if (isNaN(size) || size <= 0) {
    return "0 B";
  }

  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (size < kilobyte) {
    return size + " B";
  } else if (size < megabyte) {
    return (size / kilobyte).toFixed(2) + " KB";
  } else if (size < gigabyte) {
    return (size / megabyte).toFixed(2) + " MB";
  } else {
    return (size / gigabyte).toFixed(2) + " GB";
  }
}


const saveButton = document.getElementById('saveButton');
const emailInput = document.getElementById('email');
const apiKeyInput = document.getElementById('apiKey');
const deleteApiKeyButton = document.getElementById('deleteApiKeyButton');


saveButton.addEventListener('click', async function () {
  const email = emailInput.value;
  const apiKey = apiKeyInput.value;

  try {
    const response = await fetch('http://127.0.0.1:3000/api/saveCredentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, apiKey }),
    });

    if (response.ok) {
      console.log('Credentials saved successfully.');
      console.log("apikey: "+ apiKey);
      checkApiKey(apiKey) 

    } else {
      console.error('Failed to save credentials.');

    }
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
});

async function checkApiKey(apiKey) {
  console.log("checkapi "+ apiKey);
  try {
    const response = await fetch('http://127.0.0.1:3000/api/checkApiKey');
    const data = await response.json();
    // Afficher l'état de la clé API OpenAI dans le front-end
    const apiKeyStatus = document.getElementById('apiKeyStatus');
    if (apiKey) {
      apiKeyStatus.textContent = 'Informations enregistré';
      apiKeyStatus.style.color = "green"; // Changer la couleur en vert lorsque la clé API est chargée
    } else {
      apiKeyStatus.textContent = 'Charger vos informations';
      apiKeyStatus.style.color = "red"; // Changer la couleur en rouge lorsque la clé API n'est pas chargée
    }
    
  } catch (error) {
    console.error('Error checking API key:', error);
  }
}


deleteApiKeyButton.addEventListener('click', async () => {  
  event.preventDefault()
  try {
    const response = await fetch('http://127.0.0.1:3000/api/deleteApiKey', {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log('Informations supprimées.');
      const apiKeyStatus = document.getElementById('apiKeyStatus');
      setTimeout(() => {      
        apiKeyStatus.textContent = 'Charger vos informations';
      }, 2000);
      apiKeyStatus.textContent = 'Informations supprimées';
      apiKeyStatus.style.color = "red";
    } else {
      console.error('Erreur lors de la suppression de la clé API.');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la clé API :', error);
  }
});



// window.addEventListener('beforeunload', async function(event) {
//   try {
//     const response = await fetch('http://127.0.0.1:3000/api/deleteApiKey', {
//       method: 'DELETE'
//     });
//     if (response.ok) {
//       console.log('API Key deleted successfully.');
//     } else {
//       console.error('Failed to delete API Key.');
//     }
//   } catch (error) {
//     console.error('Error deleting API Key:', error);
//   }
// });


// setInterval(checkApiKey, 2000);  
// const apiKey = document.getElementById('apiKey');
// apiKey.addEventListener("change",  ()=>{
// checkApiKey()
// })