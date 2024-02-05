// Stocke les URL des scripts
let scriptList = [];

// Fonction pour scanner les balises <script>
function scanScripts() {
    const scripts = document.querySelectorAll('script');
    const defaultDomain = window.location.origin; // Obtient le nom de domaine par défaut de la page

    scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src) {
            // Vérifie si le script commence par "http" (externe) ou non (interne)
            const scriptUrl = src.startsWith('http') ? src : `${defaultDomain}${src}`;
            scriptList.push(scriptUrl);
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
