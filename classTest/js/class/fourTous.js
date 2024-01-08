document.addEventListener("DOMContentLoaded", () => {

    btnNav1.addEventListener("click", (title,content) => {
      let osiElements = document.querySelectorAll('[id^="osiName"]');
      let articleContenu = document.querySelector(".articleContenu");
      let borderArticle = document.querySelector(".articleContenu");
      let container = document.querySelector(".container");
    
      console.log("osielements: " +osiElements);
      console.log("articlecontenu: " +articleContenu);
      console.log("border " +borderArticle);
      container.innerHTML = osiPage.osipage(); 
     
      osiElements.forEach((osiElement) => {
        console.log("eachmouseover:" +osiElement)
        osiElement.addEventListener("mouseover", () => {
          const osiIdNumber = osiElement.id.replace("osiName", "");
          // const correspondingLiaison = document.getElementById(
          //   `liaison${osiIdNumber}`
          // );
          console.log("osiJustId"+osiIdNumber);
          // correspondingLiaison.classList.toggle("red");
          // correspondingLiaison.classList.remove("article");
        });
    
        osiElement.addEventListener("mouseout", () => {
          const osiIdNumber = osiElements.id.replace("osiName", "");
          const correspondingLiaison = document.getElementById(
            `liaison${osiIdNumber}`
          );
          console.log("liaison +osiNumber");
          correspondingLiaison.classList.remove("green");
          correspondingLiaison.classList.add("liaison");
        });
    
        osiElement.addEventListener("click", () => {
          const osiIdNumber = osiElements.id.replace("osiName", "");
          const correspondingArticle = articles[osiIdNumber - 1]; // Les articles commencent à l'index 0
          const correspondingLiaison = document.getElementById(
            `liaison${osiIdNumber}`
            );
            console.log("clickosiElement:" + osiIdNumber);
          borderArticle.style.border = "1px solid black";
          articleContenu.innerHTML = `<img src="./img/1575100148loading-gear-6.gif" style="width:8%" alt="">`;
    
          setTimeout(() => {
            correspondingLiaison.classList.add("green");
          }, 1000);
          setTimeout;
    
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
    });
    btnNav2.addEventListener("click", () => {
      const tcpipContent = tcpip.getContent();
     let container = document.querySelector(".container")
      container.innerHTML = tcpipContent;
    });
   
    
    
    
    });