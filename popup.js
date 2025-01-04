document.addEventListener('DOMContentLoaded', function() {
  const languageSelect = document.getElementById('language');
  if (languageSelect) {
      languageSelect.addEventListener('change', (event) => {
          const language = event.target.value;
          chrome.storage.local.set({targetLanguage: language});
      });
  }
  loadFavorites();

  document.getElementById('manageFavorites').addEventListener('click', function() {
      chrome.runtime.openOptionsPage(); // Opens the options page
  });
});

function loadFavorites() {
  chrome.storage.local.get({favorites: []}, function(data) {
      const favoritesList = document.getElementById('favoritesList');
      favoritesList.innerHTML = ''; // Clear existing entries
      data.favorites.forEach(fav => {
          const li = document.createElement('li');
          li.textContent = `Original: ${fav.original}, Translated: ${fav.translated}`;
          favoritesList.appendChild(li);
      });
  });
}
