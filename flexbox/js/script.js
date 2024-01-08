function changeTab(tabId) {
  const tabs = document.querySelectorAll(".menuContenu1, .menuContenu2");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  document.getElementById(tabId).style.display = "block";
}

let divCounter = 0; // Compteur pour les divs, jusqu'à 8
let navCreated = false; // Indique si la navbar a été créée
let divCreated = false;
let footerCreated = false; // Indique si le footer a été créé
const divLimit = 15; // Limite de divs à créer

function generateElement() {
  const selectValue = document.getElementById("elements").value;

  if (
    (selectValue === "nav" && !navCreated) ||
    (selectValue === "footer" && !footerCreated) ||
    (selectValue === "div" && divCounter < divLimit)
  ) {
    // Créer un nouvel élément HTML en fonction de la valeur sélectionnée
    const newElement = document.createElement(selectValue);

    if (selectValue === "nav") {
      newElement.style.width = "100%";
      newElement.style.height = "70px";
      newElement.classList.add("navmini");
      newElement.style.backgroundColor = "blue";
      navCreated = true;
    } else if (selectValue === "div") {
      newElement.style.display = "flex";
      newElement.style.width = "140px";
      newElement.style.height = "165px";
      newElement.style.margin = "2px";
      newElement.style.border = "2px solid black";
      newElement.classList.add("divmini");
      newElement.style.backgroundColor = "green";
      divCounter++;
      divCreated = true;
    } else if (selectValue === "footer") {
      newElement.style.width = "100%";
      newElement.style.height = "70px";
      newElement.classList.add("footermini");
      newElement.style.backgroundColor = "yellow";
      footerCreated = true;
    }

    newElement.innerText = "Nouvel élément "+selectValue;

    const navSimul = document.querySelector(".navSimul");
    const bodySimul = document.querySelector(".bodySimul");
    const footerSimul = document.querySelector(".footerSimul");

    if (selectValue === "nav") {
      navSimul.appendChild(newElement);
    } else if (selectValue === "div") {
      bodySimul.appendChild(newElement);
    } else if (selectValue === "footer") {
      footerSimul.appendChild(newElement);
    }
  } else {
    alert("Vous ne pouvez créer qu'un certain nombre d'éléments.");
  }
}

function applyFlexboxStyles() {
  const bodySimul = document.querySelector(".bodySimul");
  const flexWrapValue = document.getElementById("flex-wrap").value;
  const flexDirectionValue = document.getElementById("flex-direction").value;
  const justifyContentValue = document.getElementById("justify-content").value;
  const alignItemsValue = document.getElementById("align-items").value;

  // Appliquer les styles à l'élément avec la classe "bodySimul"
  bodySimul.style.cssText = `   flex-direction  : ${flexDirectionValue};
                                justify-content : ${justifyContentValue};
                                align-items     : ${alignItemsValue};
                                flex-wrap       : ${flexWrapValue}`;
}



  
  