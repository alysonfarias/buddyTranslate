let icon; // Declare the icon variable in a higher scope
let popup; // Declare the popup variable in a higher scope

document.addEventListener("mouseup", function(e) {
    setTimeout(() => {
        handleTextSelection(e);
    }, 200);
});

// Function to handle text selection and show the translation icon
function handleTextSelection(e) {
    const selectedText = window.getSelection().toString().trim();
    console.log("Selected Text:", selectedText);

    if (icon) {
        document.body.removeChild(icon);
        icon = null;
    }

    if (selectedText.length > 0) {
        icon = document.createElement("img");
        icon.src = chrome.runtime.getURL("images/translate-icon.png");

        // Calculate the position based on the selection's bounding rectangle
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const iconX = rect.left + (rect.width / 2) - 25; // Center the icon horizontally
        const iconY = rect.top - 30; // Position the icon above the selection

        icon.style.position = "fixed";
        icon.style.top = `${iconY}px`;
        icon.style.left = `${iconX}px`;
        icon.style.cursor = "pointer";
        icon.style.zIndex = "10000";
        
        // Optional: Set a size for the icon if needed
        icon.style.width = "18px";
        icon.style.height = "18px";

        document.body.appendChild(icon);

        icon.addEventListener("click", function iconClickHandler() {
            const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(
                selectedText
            )}`;
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    const translatedText = data[0][0][0];
                    console.log("Translation:", translatedText);
                    showPopup(selectedText, translatedText);
                })
                .catch((error) => console.error("Error translating text:", error));
30
            // Remove the icon after clicking
            document.body.removeChild(icon);
            icon = null;
        });
    }
}

// Add an event listener for selection change to remove the icon if no text is selected
document.addEventListener('selectionchange', function() {
    const selectedText = window.getSelection().toString().trim();
    if (icon && selectedText.length === 0) {
        document.body.removeChild(icon);
        icon = null;
    }
});

function showPopup(originalText, translatedText) {
    if (popup) {
        document.body.removeChild(popup);
    }

    // Calculate the position based on the selection's bounding rectangle
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const posX = rect.left + (rect.width / 2); // Middle of the selected text
    const posY = rect.bottom; // Bottom of the selected text

    console.log("Showing popup at:", posX, posY);

    popup = document.createElement("div");
    popup.innerHTML = `
    <div style="
        padding: 15px; 
        background-color: white; 
        border: 1px solid #10C26F; 
        border-radius: 8px; 
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); 
        position: fixed; 
        top: ${posY + 10}px; 
        left: ${posX - 150}px; 
        z-index: 10001; 
        max-width: 300px; 
        font-family: Arial, sans-serif;
        color: #000000;">
        <strong style="color: #10C26F;">Original:</strong> ${originalText}<br>
        <strong style="color: #10C26F;">Translated:</strong> ${translatedText}<br>
        <button id="saveFavorite" style="
            background-color: #10C26F; 
            color: white; 
            padding: 8px 12px; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            margin-top: 10px;">
            Save Favorite
        </button>
    </div>`;

    document.body.appendChild(popup);

    const saveButton = popup.querySelector("#saveFavorite");
    saveButton.addEventListener("click", function () {
        saveFavorite(originalText, translatedText);
    });

    // Add an event listener to dismiss the popup when clicking outside of it
    document.addEventListener('click', function dismissPopup(e) {
        if (popup && !popup.contains(e.target)) {
            document.body.removeChild(popup);
            popup = null;
            document.removeEventListener('click', dismissPopup);
        }
    }, { once: true });
}

function saveFavorite(originalText, translatedText) {
    chrome.storage.local.get({ favorites: [] }, function (data) {
        const newFavorite = { original: originalText, translated: translatedText };
        const favorites = [...data.favorites, newFavorite];
        chrome.storage.local.set({ favorites: favorites }, function () {
            console.log("Favorite saved:", newFavorite);
        });
    });
}
