chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "translate",
      title: "Translate this",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translate") {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: translateSelection,
        args: [info.selectionText]
      });
    }
  });
  
  function translateSelection(selectedText) {
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(selectedText)}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const translatedText = data[0][0][0];
        alert(`Translated text: ${translatedText}`);
      })
      .catch(error => console.error('Error translating text:', error));
  }
  