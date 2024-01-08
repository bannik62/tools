console.log("actif");

const rectangle = document.querySelector(".rectangle");
const newButton = document.createElement("button");
const nav = document.querySelector("nav");
let isActive = false;
let input;

nav.appendChild(newButton).classList.add("btn");
newButton.textContent = "click ici";
console.log("Le bouton existe.");

function toggleElement() {
  isActive = !isActive;
  rectangle.classList.toggle("active", isActive);
  rectangle.classList.toggle("activeclose", !isActive);
  if (isActive) {
    if (!document.querySelector("h2")) {
      setTimeout(function () {
        let h2 = document.createElement("h2");
        let terminal = document.createElement("div");
        let paragraphe = document.createElement("p");
        let clignotant = document.createElement("span");
        let flash = " | ";

        input = document.createElement("textarea");
        let helping = "Nouvelle aide";

        h2.style.color = "seagreen";
        h2.textContent = "hello world!";
        h2.style.backgroundColor = "black";
        terminal.classList.add("terminal");
        paragraphe.classList.add("dialogue");
        paragraphe.innerHTML = " root$: <br>";

        rectangle.appendChild(h2);
        rectangle.append(terminal);
        clignotant.innerHTML = flash;
        terminal.append(paragraphe, input, clignotant);

        const commands = {
          help: function () {
            input.value = "Vous pouvez trouver les applications disponibles :\n- Scanner_de_port\n- requete\n exit, puis appuyez sur Entrée ";
            console.log(input.value)
            input.focus();
            executeCommand();
          },
          exit: function () {
            input.value = "";
            console.log(input.value)
            input.focus();
            executeCommand();
          },
          scanner: function () {
            input.value = "Bienvenue dans le scanner de port";
            console.log(input.value)
            input.focus();
            executeCommand();
          },
          requete: function () {
            input.value = "Voici la commande requete";
            console.log(input.value)
            input.focus();
            executeCommand();
          },
        };
        
        let commandExecuted = false; // Indique si une commande a été exécutée
        
        function executeCommand() {
          commandExecuted = true;
        }
        
        input.addEventListener("keydown", function (event) {
          let sequenceTouche = input.value;
        
          if (commands[sequenceTouche]) {
            event.preventDefault();
            commands[sequenceTouche](); // Appel de la fonction de commande
        
            if (event.key === "Enter" && commandExecuted) {
              console.log(commandExecuted)
              event.preventDefault();
              commandExecuted = false;
              if ( commandExecuted == true) {
                input.value = "";
                console.log(input.value)
                input.focus();
              }
            }
          }
        });
        
                
      }, 2000);
    }
  }
}

newButton.addEventListener("click", function () {
  toggleElement();
});
