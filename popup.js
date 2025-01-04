document.addEventListener('DOMContentLoaded', function() {
  const languageSelect = document.getElementById('language');
  if (languageSelect) {
      languageSelect.addEventListener('change', (event) => {
          const language = event.target.value;
          chrome.storage.local.set({targetLanguage: language});
      });
  }
});
