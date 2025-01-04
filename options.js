document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.getElementById('exportFavorites');
    const importButton = document.getElementById('importFavorites');
    const fileInput = document.getElementById('importFile');
    const filterInput = document.getElementById('filterText');
    const favoritesList = document.getElementById('favoritesList');
    const clearButton = document.getElementById('clearFavorites'); // Clear button

    exportButton.addEventListener('click', exportFavorites);
    importButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', importFavorites);
    filterInput.addEventListener('keyup', () => loadFavorites(filterInput.value));
    clearButton.addEventListener('click', clearAllFavorites); // Event listener for clear button

    loadFavorites();

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
                    loadFavorites();
                });
            };
            reader.readAsText(file);
        }
    }

    function loadFavorites(filter = "") {
        chrome.storage.local.get({favorites: []}, function(data) {
            const filteredFavorites = data.favorites.filter(fav => fav.original.includes(filter) || fav.translated.includes(filter));
            favoritesList.innerHTML = '';
            filteredFavorites.forEach(fav => {
                const li = document.createElement('li');
                li.textContent = `Original: ${fav.original}, Translated: ${fav.translated}`;
                favoritesList.appendChild(li);
            });
        });
    }

    function clearAllFavorites() {
        if (confirm('Are you sure you want to clear all favorites? This action cannot be undone.')) {
            chrome.storage.local.set({favorites: []}, function() {
                loadFavorites(); // Refresh the list after clearing
                alert('All favorites have been cleared.');
            });
        }
    }
});
