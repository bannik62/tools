chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      // Faites ce que vous voulez avec l'URL valide
      console.log(url);
    }if (url.startsWith("chrome")) {
      console.log("L'URL est chrome!");
    }
  });