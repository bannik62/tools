import { articles,aticlesIp } from "./class/Contenu";
import { cardHtml, tcpip, osiPage, acceuil } from "./class/cardHtml";

const container = document.querySelector(".container");

function osi() {
  const osiElements = document.querySelectorAll('[id^="osiName"]');
  const articleContenu = document.querySelector(".articleContenu");
  const borderArticle = document.querySelector(".articleContenu");

  osiElements.forEach((osiElement) => {
    osiElement.addEventListener("mouseover", () => {
      const osiIdNumber = osiElement.id.replace("osiName", "");
      const correspondingLiaison = document.getElementById(
        `liaison${osiIdNumber}`
        
      );
       correspondingLiaison.classList.remove("green");
      correspondingLiaison.classList.add("liaison");
    });

    osiElement.addEventListener("mouseout", () => {
      const osiIdNumber = osiElement.id.replace("osiName", "");
      const correspondingLiaison = document.getElementById(
        `liaison${osiIdNumber}`
      );
      correspondingLiaison.classList.remove("green");
      correspondingLiaison.classList.add("liaison");
    });

    osiElement.addEventListener("click", () => {
      const osiIdNumber = osiElement.id.replace("osiName", "");
      const correspondingArticle = articles[osiIdNumber - 1];
      const correspondingLiaison = document.getElementById(
        `liaison${osiIdNumber}`
      );
      borderArticle.style.border = "1px solid black";
      articleContenu.innerHTML = `<img src="./img/1575100148loading-gear-6.gif" style="width:8%" alt="">`;

      setTimeout(() => {
        correspondingLiaison.classList.add("green");
      }, 1000);

      setTimeout(() => {
        borderArticle.style.border = "5px solid green";
      }, 1800);

      setTimeout(() => {
        articleContenu.innerHTML = cardHtml.cardHtml(
          correspondingArticle.title,
          correspondingArticle.content
        );
      }, 3000);
    });
  });
}



btnNav1.addEventListener("click", () => {
  container.style.display = "flex";
  containerAcceuil.style.display = "none";

  container.innerHTML = osiPage.osipage();
  osi(); // Appel de la fonction osi après la création dynamique du contenu
});

btnNav2.addEventListener("click", () => {
  containerAcceuil.style.display    = "flex";
  container.style.display = "none";

  containerAcceuil.style.background = "none";

  containerAcceuil.style.backgroundColor = "black";

  containerAcceuil.innerHTML = tcpip.getContent();


});

document.addEventListener("DOMContentLoaded", (acceuil) => {

});
