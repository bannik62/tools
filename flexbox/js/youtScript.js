


    
    function loadRandomVideo() {
        
        const apiKey = '***'; // Remplacez par votre clé d'API YouTube
        const keyword = encodeURIComponent(document.getElementById('keywordInput').value);
        const videoDuration = document.getElementById('videoDurationSelect').value;
        const videoType = 'video';  // Nous voulons seulement des vidéos
        const videoCategoryId = document.getElementById('videoCategoryIdSelect').value;
        const relevanceLanguage = document.getElementById('relevanceLanguageSelect').value;
      
        // Construire l'URL de l'API YouTube
        let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${keyword}&type=${videoType}`;
      
        // Ajouter les filtres
        if (videoDuration !== 'any') {
          apiUrl += `&videoDuration=${videoDuration}`;
        }
      
        if (videoCategoryId) {
          apiUrl += `&videoCategoryId=${videoCategoryId}`;
        }
      
        if (relevanceLanguage !== 'any') {
          apiUrl += `&relevanceLanguage=${relevanceLanguage}`;
        }
      
        apiUrl += `&key=${apiKey}`;
      
        fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      response.json().then(errorResponse => {
        alert(`Erreur lors de la récupération des vidéos : ${errorResponse.error.message}`);
      });
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const videos = data.items;
    if (videos.length > 0) {
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      const videoId = randomVideo.id.videoId;
      document.getElementById('videoContainer').innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      document.getElementById('videoContainer').innerHTML = 'Aucune vidéo disponible pour ces critères.';
    }
  })
  .catch(error => console.error('Erreur lors de la récupération des vidéos :', error));

      }
      