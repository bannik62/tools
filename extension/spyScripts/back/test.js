import OpenAI from "openai";

const openai = new OpenAI({apiKey : ""});
  
async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();

// 

// const maxTokens = 4000; // Limite de tokens par message

// // Fonction pour diviser le script en parties de la longueur maximale
// function splitScript(scriptContent) {
//   const parts = [];
//   let currentPart = "";

//   // Ajoutez le premier message avec la balise "first"
//   currentPart += "first\n";

//   // Divisez le script en parties
//   const tokens = scriptContent.split(/\s+/);
//   for (const token of tokens) {
//     if (currentPart.length + token.length > maxTokens) {
//       // Ajoutez le dernier message avec la balise "end" à la partie précédente
//       currentPart += "end\n";
//       parts.push(currentPart);

//       // Commencez une nouvelle partie avec le prochain "first"
//       currentPart = "first\n";
//     }

//     currentPart += token + " ";
//   }

//   // Ajoutez le dernier message avec la balise "end" à la dernière partie
//   currentPart += "end\n";
//   parts.push(currentPart);

//   return parts;
// }

// // Divisez le script en parties
// const scriptParts = splitScript(scriptContent);
// console.log(scriptParts);
// // Ensuite, envoyez chaque partie à l'API OpenAI
// for (const part of scriptParts) {
//   const chatResponse = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",   
//     messages: [
//     {"role": "system", "content": "tu es un  expert en javascript ."},   
//     { "role": "user", "content":"quand tu veras end dans un message cela sera le dernier message tu pourras analyser le code"+ part }],
//   });

//   const responseContent = chatResponse.data.choices[0].message.content;
//   console.log("Réponse de l'API OpenAI :", responseContent);
// }

// if (responseContent && responseContent.data && responseContent.data.choices) {
//     const responseContent = chatResponse.data.choices[0].message.content;
//     console.log('Réponse de l\'API OpenAI :', responseContent);
// } else {
//     console.error('La réponse de l\'API OpenAI n\'a pas le format attendu :', responseContent);
// }
