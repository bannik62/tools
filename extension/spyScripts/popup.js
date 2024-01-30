function loadScripts() {
  // Récupérez la liste des scripts depuis le contenu de la page
  chrome.runtime.sendMessage({ action: "getScripts" }, function (response) {
    if (response.scripts) {
      // Afficher la liste des scripts dans le popup
      const scriptTable = document.getElementById("scriptTable");
      response.scripts.forEach((src) => {
        const row = document.createElement("tr");
        const tdSrc = document.createElement("td");
        tdSrc.textContent = src;
        const tdDownload = document.createElement("td");
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Télécharger";
        downloadBtn.addEventListener("click", () => {
          chrome.downloads.download({ url: src });
        });
        tdDownload.appendChild(downloadBtn);
        row.appendChild(tdSrc);
        row.appendChild(tdDownload);
        scriptTable.appendChild(row);
      });
    }
  });
}
