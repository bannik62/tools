document.addEventListener("DOMContentLoaded", function () {
  chrome.windows.getLastFocused({ populate: true }, function (currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
      const activeTab = activeTabs[0];
      const tabUrl = activeTab.url;

      // Vérifier si l'URL correspond au modèle souhaité
      if (tabUrl.startsWith("http:")||("https:")) {
        // Récupérer la liste des scripts depuis le contenu de la page
        chrome.tabs.sendMessage(activeTab.id, { action: "getScripts" }, function (response) {
          if (response && response.scripts) {
            // Afficher la liste des scripts dans le popup
            const scriptTable = document.getElementById("scriptTable");
            response.scripts.forEach(function (src) {
              const row = document.createElement("tr");
              const tdSrc = document.createElement("td");
              tdSrc.textContent = src;
              const tdDownload = document.createElement("td");
              const downloadBtn = document.createElement("button");
              downloadBtn.textContent = "Télécharger";
              downloadBtn.addEventListener("click", function () {
                chrome.downloads.download({ url: src });
              });
              tdDownload.appendChild(downloadBtn);
              row.appendChild(tdSrc);
              row.appendChild(tdDownload);
              scriptTable.appendChild(row);
            });
          } else {
            console.error("Erreur : aucune réponse ou la liste des scripts n'a pas été récupérée.");
          }
        });
      } else {
        console.error("Erreur : l'URL actuelle ne correspond pas au modèle souhaité.");
      }
    });
  });
});