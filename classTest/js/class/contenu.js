class Contenu {
  constructor(title, content,texte) {
    this.title = title;
    this.content = content;
    this.texte = texte
  }
}

const articles = [
  new Contenu("La couche Application ",
   `Niveau auquel l'utilisateur interagit avec les applications réseau.</br>
Assure la fourniture des services de communication, gère les interactions entre les applications et l'utilisateur.`),
  
new Contenu("La couche Présentation ",
   `Fournit une représentation compréhensible des données pour l'application ou l'utilisateur final.</br>
  Traite les différences de formats de données, compression, chiffrement et conversion.`),
 
  new Contenu("La couche Session", `Gère les sessions de communication entre les applications sur différents appareils.</br>
  Établit, maintient et termine les connexions, gère la synchronisation et la reprise en cas d'erreur.`),
  
  new Contenu("La couche Transport ", `Fournit des mécanismes de transfert de bout en bout des données.</br>
  Segmentent, contrôlent et réassemblent les paquets.
  Gère le contrôle d'erreurs et les mécanismes de récupération de perte de données.`),
 
  new Contenu("La couche Reseau", `Assure la connectivité et le routage des données entre différents réseaux.
  Implique des mécanismes de contrôle de trafic et de congestion.
  Utilise des adresses logiques pour l'acheminement des paquets de données.`),
 
  new Contenu("La couche liaison de données", `Sous-divisée en deux sous-couches :</br> LLC (Logical Link Control) et MAC (Media Access Control).
  Gère la liaison entre les nœuds de données directs sur un même réseau local.
  Offre un cadre pour l'identification, la correction d'erreurs et le contrôle de flux des données.`),
 
  new Contenu("La couche Physique ", `Gère la transmission des données brutes sur le support physique (câbles, ondes, etc.).</br>
  Contrôle les aspects électriques, mécaniques et fonctionnels pour envoyer des bits sur un médium de transmission.`),

  // Ajoutez d'autres articles si nécessaire
];

const articlesIp =[
  new Contenu("TCP/IP désigne communément une architecture réseau, mais cet acronyme désigne en fait 2 protocoles étroitement liés : un protocole de transport, TCP (Transmission Control Protocol) qu’on utilise « par-dessus » un protocole réseau, IP (Internet Protocol). Ce qu’on entend par « modèle TCPIP », c’est en fait une architecture réseau en 4 couches dans laquelle les protocoles TCP et IP jouent un rôle prédominant, car ils en constituent l’implémentation la plus courante. Par abus de langage, TCP/IP peut donc désigner deux choses : le modèle TCP/IP et la suite de deux protocoles TCP et IP  Le modèle TCP/IP, comme nous le verrons plus bas, s’est progressivement imposé comme modèle de référence en lieu et place du modèle OSI. Cela tient tout simplement à son histoire. En effet, contrairement au modèle OSI, le modèle TCP/IP est né d’une implémentation ; la normalisation est venue ensuite. Cet historique fait toute la particularité de ce modèle, ses avantages et ses inconvénients.L’origine du modèle TCPIP remonte au réseau ARPANET. ARPANET est un réseau de télécommunication conçu par l’ARPA (Advanced Research Projects Agency), l’agence de recherche du ministère américain de la défense (le DOD : Department of Defense). Outre la possibilité de connecter des réseaux hétérogènes, ce réseau devait résister à une éventuelle guerre nucléaire, contrairement au réseau téléphonique habituellement utilisé pour les télécommunications mais considéré trop vulnérable. Il a alors été convenu qu’ARPANET utiliserait la technologie de commutation par paquet (mode datagramme), une technologie émergeante promettante. C’est donc dans cet objectif et ce choix technique que les protocoles TCP et IP furent inventés en 1974. L’ARPA signa alors plusieurs contrats avec les constructeurs (BBN principalement) et l’université de Berkeley qui développait un Unix pour imposer ce standard, ce qui fut fait")
]

export { Contenu, articles,articlesIp };
