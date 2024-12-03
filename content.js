if (typeof browser === "undefined") {
  var browser = chrome;
  console.log('[BLOCK PARTY] Polyfill executed.')
}

console.log('[BLOCK PARTY] Content script loaded');

browser.storage.local.get('phrases', function(data) {
  const phrases = data.phrases || [];
  console.log('[BLOCK PARTY] Retrieved phrases:', phrases);

  phrases.forEach(function(phrase) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'i'); // Create a case-insensitive regex for whole words
    console.log(`[BLOCK PARTY] Searching for elements containing the whole word: "${phrase}"`);

    document.querySelectorAll('*').forEach(function(element) {
      if (element.children.length === 0 && regex.test(element.textContent)) {
        let parent = element;
        // Traverse up the DOM to find a suitable parent to hide
        while (parent && parent.parentElement && parent.textContent.trim().length < 100) {
          parent = parent.parentElement;
        }
        parent.style.opacity = '0';
        console.log('[BLOCK PARTY] Set opacity to 0 for element:', parent);
      }
    });

    // Check image tags for alt attributes containing the phrase
    document.querySelectorAll('img').forEach(function(img) {
      if (regex.test(img.alt)) {
        img.style.opacity = '0';
        console.log('[BLOCK PARTY] Set opacity to 0 for image with alt text:', img.alt);
      }
    });
  });
});