function nutrition() {
  const codeBarre = document.getElementById("responseN").value;
  const apiUrl = `https://world.openfoodfacts.net/api/v2/product/${codeBarre}?fields=product_name,nutriscore_data,nutriments,nutrition_grades`;

  const responseDiv = document.getElementById("responseN");
  responseDiv.innerHTML = ""; // Clear previous response

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Votre produit n'existe pas");
      }
      return response.json();
    })
    .then((data) => {
      // Accéder aux propriétés nécessaires dans la réponse JSON
      const productName = data.product.product_name;
      const nutriscoreData = data.product.nutriscore_data;
      const nutriments = data.product.nutriments;
      const nutritionGrades = data.product.nutrition_grades;

      // Créer une fenêtre popup
      const popupWindow = window.open("", "popup", "width=600,height=400");

      // Construire le contenu de la fenêtre popup
      const popupContent = `
        <h2>Nom du produit :</h2>
        <p>${productName}</p>
        <h2>Nutriscore :</h2>
        <p>${nutriscoreData.grade}</p>
        <h2>Nutriments :</h2>
        ${createNutrimentsTable(nutriments)}
        <h2>Grades nutritionnels :</h2>
        <p>${nutritionGrades}</p>
      `;

      // Mettre le contenu dans la fenêtre popup
      popupWindow.document.body.innerHTML = popupContent;
    })
    .catch((error) => {
      responseDiv.innerText = `Erreur : ${error.message}`;
    });
}

// Fonction pour créer un tableau des nutriments
function createNutrimentsTable(nutriments) {
  let tableHtml = "<table border='1'>";
  tableHtml += "<tr><th>Nutriment</th><th>Valeur</th></tr>";

  for (const nutriment in nutriments) {
    tableHtml += `<tr><td>${nutriment}</td><td>${nutriments[nutriment]}</td></tr>`;
  }

  tableHtml += "</table>";
  return tableHtml;
}

var _scannerIsRunning = false;

function startScanner() {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#scanner-container"),
        constraints: {
          width: 400,
          height: 400,
        },
         video: {
          facingMode: { exact: "user" }, // Utiliser la caméra arrière
          mirror: true, // Désactiver l'effet miroir
        },
      },
      numOfWorkers: navigator.hardwareConcurrency,

      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
          "code_39_vin_reader",
          "codabar_reader",
          "upc_reader",
          "upc_e_reader",
          "i2of5_reader",
        ],
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true,
          showCanvas: true,
          showPatches: true,
          showFoundPatches: true,
          showSkeleton: true,
          showLabels: true,
          showPatchLabels: true,
          showRemainingPatchLabels: true,
          boxFromPatches: {
            showTransformed: true,
            showTransformedBox: true,
            showBB: true,
          },
        },
        locator: {
          halfSample: false,
          patchSize: "medium",
          showCanvas: true,
          showPatches: true,
          showFoundPatches: true,
          showSkeleton: true,
          boxFromPatches: {
            showTransformed: true,
            showTransformedBox: true,
            showBB: true,
          },
          area: {
            top: "10%", // top offset
            right: "10%", // right offset
            left: "10%", // left offset
            bottom: "10%", // bottom offset
          },
        },
        singleChannel: false, // true: only the red color-channel is read
        numOfWorkers: 3, // Nombre de "workers" à utiliser

      },
    },
    function (err) {
      if (err) {
        console.log(err);
        return;
      }
      // document.querySelector("video").style.transform = "scaleX(-1)";

      console.log("Initialization finished. Ready to start");
      Quagga.start();

      // Set flag to is running
      _scannerIsRunning = true;
    }
  );

  Quagga.onProcessed(function (result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute("width")),
          parseInt(drawingCanvas.getAttribute("height"))
        );
        result.boxes
          .filter(function (box) {
            return box !== result.box;
          })
          .forEach(function (box) {
            // Ajustez la classe du carré vert en fonction de la taille souhaitée
            var boxClassName = "huge";
            Quagga.ImageDebug.drawPath(
              box,
              { x: 0, y: 1 },
              drawingCtx,
              { color: "green", lineWidth: 4, className: boxClassName }
            );
          });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(
          result.box,
          { x: 0, y: 1 },
          drawingCtx,
          { color: "#00F", lineWidth: 2 }
        );
        console.log(result.box);
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(
          result.line,
          { x: "x", y: "y" },
          drawingCtx,
          { color: "red", lineWidth: 3 }
        );
      }
    }
  });

  Quagga.onDetected(function (result) {
    const detectedCode = result
      ? result.codeResult.code
      : "Aucun code-barres détecté.";

    document.getElementById("responseN").value = detectedCode;

    console.log("Barcode detected and processed:", detectedCode);
  });
}

// Start/stop scanner
document.getElementById("btn").addEventListener(
  "click",
  function () {
    if (_scannerIsRunning) {
      console.log(_scannerIsRunning);
      Quagga.stop();
      document.querySelector("video").style.display = "none";
      document.getElementById("canvas").style.display = "none";


    } else {
      startScanner();
      document.getElementById("video").style.display = "block";
      document.getElementById("canvas").style.display = "none";


    }
  },
  false
);
 




