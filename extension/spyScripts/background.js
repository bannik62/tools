// Injecte le contenu script dans l'onglet actif
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log(tabs[0]);
    const tab = tabs[0];
    if (!tab.url.startsWith("chrome://")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });
    } else {
        console.log("Skipping injection into Chrome internal page.");
    }
});
