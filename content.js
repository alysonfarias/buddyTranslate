document.addEventListener("dblclick", function (e) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("images/translate-icon.png");
    icon.style.position = "fixed";
    icon.style.top = `${e.pageY - 20}px`; // Adjust icon position
    icon.style.left = `${e.pageX + 20}px`; // Adjust icon position
    icon.style.cursor = "pointer";
    icon.style.zIndex = "10000";
    document.body.appendChild(icon);

    icon.addEventListener("click", () => {
      const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(
        selectedText
      )}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const translatedText = data[0][0][0];
          showPopup(selectedText, translatedText, e.pageX, e.pageY);
        })
        .catch((error) => console.error("Error translating text:", error));
      document.body.removeChild(icon); // Remove the icon after clicking
    });
  }
});

document.addEventListener('mouseup', function(e) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        // Remove any existing icon to prevent duplicates
        const existingIcon = document.getElementById('translate-icon');
        if (existingIcon) {
            document.body.removeChild(existingIcon);
        }

        const icon = document.createElement('img');
        icon.id = 'translate-icon'; // Set an ID for easy removal later
        icon.src = chrome.runtime.getURL("images/translate-icon.png"); // Properly link the image
        icon.style.position = 'fixed';
        icon.style.top = `${e.pageY - 20}px`; // Adjust the icon's vertical position
        icon.style.left = `${e.pageX + 20}px`; // Adjust the icon's horizontal position
        icon.style.cursor = 'pointer';
        icon.style.zIndex = '10000';
        icon.style.width = '50px'; // Set width for visibility
        icon.style.height = '50px'; // Set height for visibility
        document.body.appendChild(icon);

        icon.addEventListener('click', () => {
            console.log("Icon clicked for translation");
            // Your translation logic goes here
            alert(`Translating: ${selectedText}`); // Test action
            document.body.removeChild(icon); // Remove the icon after clicking
        });

        // Optional: Remove the icon if the user clicks anywhere outside of it
        document.addEventListener('click', function removeIcon(e) {
            if (!icon.contains(e.target)) {
                document.body.removeChild(icon);
                document.removeEventListener('click', removeIcon); // Remove the listener
            }
        });
    }
});


function showPopup(originalText, translatedText, posX, posY) {
  const popup = document.createElement("div");
  popup.innerHTML = `
  <div style="
      padding: 15px; 
      background-color: white; 
      border: 1px solid #10C26F; 
      border-radius: 8px; 
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); 
      position: fixed; 
      top: ${posY - 60}px; 
      left: ${posX + 20}px; 
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

  // Automatically remove the popup after 5 seconds
  setTimeout(() => {
    if (document.body.contains(popup)) {
      document.body.removeChild(popup);
    }
  }, 5000);
}

setTimeout(() => {
  if (document.body.contains(popup)) {
    document.body.removeChild(popup);
  }
}, 5000);

function saveFavorite(originalText, translatedText) {
  chrome.storage.local.get({ favorites: [] }, function (data) {
    const newFavorite = { original: originalText, translated: translatedText };
    const favorites = [...data.favorites, newFavorite];
    chrome.storage.local.set({ favorites: favorites }, function () {
      console.log("Favorite saved:", newFavorite);
    });
  });
}
