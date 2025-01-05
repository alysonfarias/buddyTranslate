let icon;
let popup;

document.addEventListener("mouseup", function (e) {
    setTimeout(() => {
        handleTextSelection(e);
    }, 200);
});

function handleTextSelection(e) {
    const selectedText = window.getSelection().toString().trim();
    if (icon) {
        document.body.removeChild(icon);
        icon = null;
    }

    if (selectedText.length > 0) {
        icon = document.createElement("img");
        icon.src = chrome.runtime.getURL("images/translate-icon.png");
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const iconX = rect.left + (rect.width / 2) - 15;
        const iconY = rect.top - 30;

        icon.style.position = "fixed";
        icon.style.top = `${iconY}px`;
        icon.style.left = `${iconX}px`;
        icon.style.cursor = "pointer";
        icon.style.zIndex = "10000";
        icon.style.width = "30px";
        icon.style.height = "30px";

        document.body.appendChild(icon);

        icon.addEventListener("click", function iconClickHandler() {
            const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(
                selectedText
            )}`;
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    const translatedText = data[0][0][0];
                    showPopup(selectedText, translatedText);
                })
                .catch((error) => console.error("Error translating text:", error));

            document.body.removeChild(icon);
            icon = null;
        });
    }
}

document.addEventListener('selectionchange', function () {
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

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const posX = rect.left + (rect.width / 2);
    const posY = rect.bottom;

    popup = document.createElement("div");
    popup.innerHTML = `
    <div style="
        padding: 20px; 
        background-color: #f3f4f6; 
        border: 1px solid #d1d5db; 
        border-radius: 10px; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
        position: fixed; 
        top: ${posY + 10}px; 
        left: ${posX - 150}px; 
        z-index: 10001; 
        max-width: 320px; 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #1f2937;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="display: flex; gap: 10px;">
                <span style="cursor: pointer; font-size: 18px;" id="audio" title="Play Audio">&#127911;</span>
                <span style="cursor: pointer; font-size: 18px;" id="settings" title="Settings">&#9881;</span>
                <span style="cursor: pointer; font-size: 18px;" id="saveFavorite" title="Save Favorite">&#9733;</span> <!-- Star icon for saving -->
            </div>
            <span style="cursor: pointer; font-size: 18px; color: #ef4444;" id="close" title="Close">&#10006;</span>
        </div>
        <div style="margin-bottom: 10px;">
         ${originalText} <span style="cursor: pointer; font-size: 18px;" id="copyOriginal" title="Copy Original">&#128203;</span>
        </div>
        <hr>
        <div style="margin-bottom: 15px;">
         ${translatedText} <span style="cursor: pointer; font-size: 18px;" id="copyTranslation" title="Copy Translation">&#128203;</span>
        </div>
    </div>`;

    document.body.appendChild(popup);

    const copyOriginal = popup.querySelector("#copyOriginal");
    copyOriginal.addEventListener("click", function() {
        navigator.clipboard.writeText(originalText).then(() => {
            console.log("Original text copied!");
        });
    });

    const copyTranslation = popup.querySelector("#copyTranslation");
    copyTranslation.addEventListener("click", function() {
        navigator.clipboard.writeText(translatedText).then(() => {
            console.log("Translated text copied!");
        });
    });

    const closeIcon = popup.querySelector("#close");
    closeIcon.addEventListener("click", function() {
        document.body.removeChild(popup);
        popup = null;
    });

    const audioIcon = popup.querySelector("#audio");
    audioIcon.addEventListener("click", function() {
        console.log("Play audio (functionality to be implemented)");
    });

    const settingsIcon = popup.querySelector("#settings");
    settingsIcon.addEventListener("click", function() {
        console.log("Open settings (functionality to be implemented)");
    });

    const saveFavoriteIcon = popup.querySelector("#saveFavorite");
    saveFavoriteIcon.addEventListener("click", function() {
        saveFavorite(originalText, translatedText);
    });

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
