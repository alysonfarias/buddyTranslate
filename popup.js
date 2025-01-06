document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language');
    
    // Load the last selected language from the Chrome storage
    chrome.storage.local.get({targetLanguage: 'en'}, function(data) {
        languageSelect.value = data.targetLanguage;
    });
  
    if (languageSelect) {
        languageSelect.addEventListener('change', (event) => {
            event.target.style.backgroundColor = "#D6EAF8"; // Highlight the selected language
            const language = event.target.value;
            // Save the selected language in the Chrome storage
            chrome.storage.local.set({targetLanguage: language});
        });
    }
  
    loadFavorites();
  
    const manageFavoritesBtn = document.getElementById('manageFavorites');
    manageFavoritesBtn.addEventListener('click', function() {
        manageFavoritesBtn.style.transform = "scale(0.95)"; // Click effect
        setTimeout(() => { manageFavoritesBtn.style.transform = "scale(1)"; }, 200); // Reset after click
        chrome.runtime.openOptionsPage(); // Opens the options page
    });
  
    manageFavoritesBtn.addEventListener('mouseover', function() {
        manageFavoritesBtn.style.backgroundColor = "#D6EAF8"; // Hover effect
    });
  
    manageFavoritesBtn.addEventListener('mouseout', function() {
        manageFavoritesBtn.style.backgroundColor = ""; // Reset on mouse out
    });
});
  
function loadFavorites() {
    chrome.storage.local.get({favorites: []}, function(data) {
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = ''; // Clear existing entries
  
        const lastThreeFavorites = data.favorites.slice(-3);
  
        lastThreeFavorites.forEach(fav => {
            const li = document.createElement('li');
            li.textContent = `Original: ${fav.original}, Translated: ${fav.translated}`;
            li.style.opacity = "0";
            favoritesList.appendChild(li);
            setTimeout(() => { li.style.opacity = "1"; }, 200); // Fade-in effect for new favorites
        });
    });
}
