class cardHtml {
  static cardHtml(title, article) {
    return `
      <div class="card">
      <h3>${title}</h3>
      <p>${article}</p>
    </div>
      `;
  }
}

class acceuil {
  static acceuil() {
    return `
    <div class="acceuil"> 
      <img src="../../img/1.jpeg" alt=""  />
      </div>
    `;
  }
}

class osiPage {
  static osipage() {
    console.log("hello");
    // Définition des éléments dans le DOM
    let osiContent = `
      <div id="osi">
        <div id="osiName1" class="application osiName"><p>Application</p></div>
        <div id="osiName2" class="presentation osiName"><p>Présentation</p></div>
        <div id="osiName3" class="session osiName"><p>Session</p></div>
        <div id="osiName4" class="transport osiName"><p>Transport</p></div>
        <div id="osiName5" class="reseau osiName"><p>Réseau</p></div>
        <div id="osiName6" class="liaisonDonnées osiName"><p>Liaison Données</p></div>
        <div id="osiName7" class="physique osiName"><p>Physique</p></div>
      </div>

      <div id="containerLiaison">
        <div id="liaison1" class="liaison"></div>
        <div id="liaison2" class="liaison"></div>
        <div id="liaison3" class="liaison"></div>
        <div id="liaison4" class="liaison"></div>
        <div id="liaison5" class="liaison"></div>
        <div id="liaison6" class="liaison"></div>
        <div id="liaison7" class="liaison"></div>
      </div>

      <div id="article" class="article">
        <div id="articleContenu" class="articleContenu"></div>
      </div>
    `;
    return osiContent;
  }
}

class tcpip {
  static getContent() {
    let str = `<p>ici futur page pour le tcp ip (cette phrase possede )</p>`; 
        str = str.split("")
        let ajout = "pour les futur ingenieurs "
        str.splice(60, 0, ...ajout.split(""))
        console.log("slcestr:"+str);
    let cara = "caracteres"
        cara.split(cara)
    let carataille = cara.length    
    let taille = str.length
        // cara = cara.split('')
    str.push(carataille)
    
    console.log("log:"+str);

    return `<p>ici futur page pour le tcp ip ${ajout} (cette phrrase possede ${taille + carataille} ${cara} )</p>
    <video src="https://www.frameip.com/wp-content/espace-multimedia-video/frameip.com-322-what-is-the-internet-protocol-stack.mp4" controls="" controlslist="nodownload" autoplay="" height="300" width="400">
			Désolé, ton browser ne supporte pas le tag Video.
			</video>` ;
  }
}
console.log(tcpip.getContent)
export { cardHtml, acceuil, osiPage, tcpip };
