// Stocke les URL des scripts
let scriptList = [];

// Fonction pour scanner les balises <script>
function scanScripts() {
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src) {
            scriptList.push(src);
        }
    });
}

// Exécute la fonction de scan au chargement de la page
scanScripts();

// Envoie la liste des scripts à l'arrière-plan lorsqu'un message est reçu
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'getScripts') {
        sendResponse({ scripts: scriptList });
    }
});
