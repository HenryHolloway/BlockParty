if (typeof browser === "undefined") {
    var browser = chrome;
}

document.getElementById('addPhrase').addEventListener('click', function() {
    console.log('[BLOCK PARTY] Add Phrase button clicked.');
    const phraseInput = document.getElementById('phrase');
    const phrase = phraseInput.value.trim();
    console.log('[BLOCK PARTY] Retrieved and trimmed phrase from input:', phrase);
    if (phrase) {
        browser.storage.local.get('phrases', function(data) {
            console.log('[BLOCK PARTY] Retrieved phrases from storage:', data.phrases);
            const phrases = data.phrases || [];
            phrases.push(phrase);
            console.log('[BLOCK PARTY] Updated phrases list:', phrases);
            browser.storage.local.set({phrases: phrases}, function() {
                console.log('[BLOCK PARTY] Phrases saved to storage.');
                updatePhraseList(phrases);
            });
        });
        addPhraseToList(phrase);
        phraseInput.value = '';
    } else {
        console.log('[BLOCK PARTY] No phrase entered.');
    }
});

function addPhraseToList(phrase) {
    console.log('[BLOCK PARTY] Adding phrase to list:', phrase);
    const phraseList = document.getElementById('phraseList');
    const listItem = document.createElement('li');
    listItem.textContent = phrase;

    // Create a delete button for each list item
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.addEventListener('click', function() {
        console.log('[BLOCK PARTY] Deleting phrase from list:', phrase);
        phraseList.removeChild(listItem);

        // Update storage to remove the deleted phrase
        browser.storage.local.get('phrases', function(data) {
            const phrases = data.phrases || [];
            const updatedPhrases = phrases.filter(p => p !== phrase);
            browser.storage.local.set({phrases: updatedPhrases}, function() {
                console.log('[BLOCK PARTY] Updated phrases saved to storage after deletion.');
            });
        });
    });

    listItem.appendChild(deleteButton);
    phraseList.appendChild(listItem);
}

function updatePhraseList(phrases) {
    console.log('[BLOCK PARTY] Updating phrase list in UI.');
    const list = document.getElementById('phraseList');
    list.innerHTML = '';
    phrases.forEach(function(phrase) {
        console.log('[BLOCK PARTY] Adding phrase to list:', phrase);
        addPhraseToList(phrase);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('[BLOCK PARTY] Document loaded. Retrieving phrases from storage.');
    browser.storage.local.get('phrases', function(data) {
        console.log('[BLOCK PARTY] Retrieved phrases from storage on load:', data.phrases);
        updatePhraseList(data.phrases || []);
    });
});