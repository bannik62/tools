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
                  const downloadBtn = document.createElement("button");
                  const analyseBtn = document.createElement("button");

                  downloadBtn.textContent = "Télécharger";
                  downloadBtn.addEventListener("click", function () {
                    chrome.downloads.download({ url: scriptUrl });
                  });

                  analyseBtn.textContent = "Analyser";
                  analyseBtn.addEventListener("click", async () => {
                    // Affiche une fenêtre de chargement
                    window.alert(
                      "Ne fermez pas la fenetre de l'extensions l'analyse peut prendre un temps conséquent"
                    );
                    try {
                      // Envoie le script pour analyse au serveur
                      const responses = await sendScriptForAnalysis(scriptUrl);
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
                            analyse.innerHTML = `Résultats de l'analyse  : ${JSON.stringify(
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
                  tdDownload.appendChild(analyseBtn); // Ajout du bouton d'analyse à côté du bouton de téléchargement
                  row.appendChild(tdDownload);

                  scriptTable.appendChild(row);

                  getScriptSize(scriptUrl, function (size) {
                    tdSize.textContent = formatFileSize(size);
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

