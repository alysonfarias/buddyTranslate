document.addEventListener('DOMContentLoaded', function() {
    loadFavorites();
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
