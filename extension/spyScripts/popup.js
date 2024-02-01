
document.addEventListener("DOMContentLoaded", function() {
  chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id }, function(activeTabs) {
      const activeTab = activeTabs[0];
      const tabUrl = activeTab.url;

      if  (tabUrl.startsWith("https:") || tabUrl.endsWith(".js")) {
        chrome.tabs.sendMessage(activeTab.id, { action: "getScripts" }, function(response) {
          if (response && response.scripts) {
            const scriptTable = document.getElementById("scriptTable");
            response.scripts.forEach(function(scriptUrl) {
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
              downloadBtn.addEventListener("click", function() {
                chrome.downloads.download({ url: scriptUrl });
              });
              analyseBtn.textContent = "Analyser";
             
                analyseBtn.addEventListener("click", () => {
                  console.log(scriptUrl);
                  sendScriptForAnalysis(scriptUrl);
                });
             

              function sendScriptForAnalysis(scriptContent) {
                const apiUrl = 'http://127.0.0.1/api/analyse'; // Remplacez cela par l'URL de votre backend

                fetch(scriptContent, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ scriptContent: scriptContent }),
                })
                .then(response => {
                   if (!response.ok) {
                     throw new Error(`Réponse non OK: ${response.statusText}`);
                   }
                   return response.json();
                })
                .then(data => {
                   console.log("Réponse du backend :", data);
                })
                .catch(error => {
                   console.error("Erreur lors de l'envoi du script au backend :", error);
                });
                
              }

              tdDownload.appendChild(downloadBtn);
              tdDownload.appendChild(analyseBtn);  // Ajout du bouton d'analyse à côté du bouton de téléchargement
              row.appendChild(tdDownload);

              scriptTable.appendChild(row);

              getScriptSize(scriptUrl, function(size) {
                tdSize.textContent = formatFileSize(size);
              });
            });
          } else {
            console.error("Erreur : aucune réponse ou la liste des scripts n'a pas été récupérée.");
          }
        });
      } else {
        console.error("Erreur : L'URL ne correspond pas au modèle souhaité.");
      }
    });
  });
});

function getScriptSize(url, callback) {
  fetch(url, { method: 'HEAD' })
    .then(response => {
      const size = response.headers.get('content-length');
      console.log("lengt" + size);
      callback(parseInt(size, 5));
    })
    .catch(error => {
      callback(0);
    });
}

function formatFileSize(size) {
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
