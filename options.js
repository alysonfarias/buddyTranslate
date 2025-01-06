let flashcardContainer = document.getElementById('flashcard-container');
let flashcardElement = document.getElementById('flashcard');
let flashcards = [];
let currentFlashcardIndex = 0;

chrome.storage.local.get({favorites: []}, function(data) {
    flashcards = data.favorites;
    updateFlashcard();
});

// Add an event listener to the flashcard to flip it
flashcardElement.addEventListener('click', function() {
    let flashcardFront = flashcardElement.querySelector('.flashcard-front');
    let flashcardBack = flashcardElement.querySelector('.flashcard-back');

    if (flashcardFront.style.display === 'none') {
        flashcardFront.style.display = 'block';
        flashcardBack.style.display = 'none';
    } else {
        flashcardFront.style.display = 'none';
        flashcardBack.style.display = 'block';
    }
});

// Add the logic to cycle through the flashcards
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
        currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
        updateFlashcard();
    } else if (e.key === 'ArrowLeft') {
        currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcards.length) % flashcards.length;
        updateFlashcard();
    }
});

// Update the flashcard with the current translation
function updateFlashcard() {
    if (flashcards.length > 0) {
        let flashcard = flashcards[currentFlashcardIndex];
        flashcardElement.innerHTML = `
            <div class="flashcard-front">
                ${flashcard.original}
            </div>
            <div class="flashcard-back" style="display: none;">
                ${flashcard.translated}
            </div>
        `;
    } else {
        flashcardElement.textContent = 'No flashcards available';
    }
}

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
    function loadFavorites(filter = "") {
        chrome.storage.local.get({favorites: []}, function(data) {
            const filteredFavorites = data.favorites.filter(fav => fav.original.includes(filter) || fav.translated.includes(filter));
            favoritesList.innerHTML = '';
            filteredFavorites.forEach(fav => {
                const li = document.createElement('li');
                const originalSpan = document.createElement('span');
                originalSpan.className = 'original'; // Apply class for styling
                originalSpan.textContent = `Original: ${fav.original}`;
                originalSpan.onclick = function() { copyToClipboard(fav.original) };
    
                const translatedSpan = document.createElement('span');
                translatedSpan.className = 'translated'; // Apply class for styling
                translatedSpan.textContent = ` Translated: ${fav.translated}`;
                translatedSpan.onclick = function() { copyToClipboard(fav.translated) };
    
                li.appendChild(originalSpan);
                li.appendChild(translatedSpan);
                favoritesList.appendChild(li);
            });
        });
    }
    

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard');
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
    
    let flashcards = [
        { question: "Question 1", answer: "Answer 1", nextReview: 0 },
        { question: "Question 2", answer: "Answer 2", nextReview: 0 },
        { question: "Question 3", answer: "Answer 3", nextReview: 0 },
        // add more flashcards as needed
    ];
    
    function spacedRepetition() {
        const currentDate = Date.now();
        for (let flashcard of flashcards) {
            if (flashcard.nextReview <= currentDate) {
                // Show flashcard to the user and wait for their answer
                // If the answer is correct, increase the nextReview date:
                // For example, delay the next review by 2 days: 
                flashcard.nextReview = currentDate + 2 * 24 * 60 * 60 * 1000;
                // Adjust the delay as needed based on the user's performance,
                // the difficulty of the flashcard, etc.
            }
        }
    }
    
});
