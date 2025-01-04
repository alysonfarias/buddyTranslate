document.addEventListener('dblclick', function(e) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
      const icon = document.createElement('img');
      icon.src = chrome.runtime.getURL('images/translate-icon.png');
      icon.style.position = 'fixed';
      icon.style.top = `${e.pageY - 20}px`; // Adjust icon position
      icon.style.left = `${e.pageX + 20}px`; // Adjust icon position
      icon.style.cursor = 'pointer';
      icon.style.zIndex = '10000';
      document.body.appendChild(icon);

      icon.addEventListener('click', () => {
          const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(selectedText)}`;
          fetch(apiUrl)
              .then(response => response.json())
              .then(data => {
                  const translatedText = data[0][0][0];
                  showPopup(translatedText, e.pageX, e.pageY);
              })
              .catch(error => console.error('Error translating text:', error));
          document.body.removeChild(icon); // Remove the icon after clicking
      });
  }
});

function showPopup(translatedText, posX, posY) {
  const popup = document.createElement('div');
  popup.innerHTML = `<div style="padding: 10px; background-color: white; border: 1px solid black; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0,0,0,0.5); position: fixed; top: ${posY}px; left: ${posX}px; z-index: 10001;">${translatedText}</div>`;
  document.body.appendChild(popup);

  setTimeout(() => { // Automatically remove the popup after some time
      if (document.body.contains(popup)) {
          document.body.removeChild(popup);
      }
  }, 5000);
}
