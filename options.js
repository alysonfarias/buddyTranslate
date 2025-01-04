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

function exportFavorites() {
    chrome.storage.local.get({favorites: []}, function(data) {
        const blob = new Blob([JSON.stringify(data.favorites)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favorites.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}

function importFavorites(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const favorites = JSON.parse(e.target.result);
            chrome.storage.local.set({favorites}, function() {
                loadFavorites(); // Refresh the list after importing
            });
        };
        reader.readAsText(file);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('exportFavorites').addEventListener('click', exportFavorites);
    document.getElementById('importFavorites').addEventListener('click', function() {
        document.getElementById('importFile').click(); // Trigger file input for importing
    });
    document.getElementById('importFile').addEventListener('change', importFavorites);
    loadFavorites();
});


function loadFavorites(filter = "") {
    chrome.storage.local.get({favorites: []}, function(data) {
        const filteredFavorites = data.favorites.filter(fav => fav.original.includes(filter) || fav.translated.includes(filter));
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = '';
        filteredFavorites.forEach(fav => {
            const li = document.createElement('li');
            li.textContent = `Original: ${fav.original}, Translated: ${fav.translated}`;
            favoritesList.appendChild(li);
        });
    });
}
