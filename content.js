document.addEventListener('dblclick', function(e) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
      const icon = document.createElement('img');
      icon.src = chrome.runtime.getURL('images/translate-icon.png');
      icon.style.position = 'fixed';
      icon.style.top = `${e.pageY}px`;
      icon.style.left = `${e.pageX}px`;
      icon.style.cursor = 'pointer';
      icon.style.zIndex = '10000';
      document.body.appendChild(icon);

      icon.addEventListener('click', () => {
          chrome.runtime.sendMessage({
              task: "translate",
              text: selectedText
          });
          document.body.removeChild(icon); // Remove the icon after clicking
      });

      setTimeout(() => { // Remove the icon if not clicked after some time
          if (document.body.contains(icon)) {
              document.body.removeChild(icon);
          }
      }, 5000);
  }
});
