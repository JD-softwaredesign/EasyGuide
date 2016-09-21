
chrome.storage.local.set({isRecording: false, targets: [], guides: {}, currentGuide: []}, function() {
  alert("reset");
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id === tabId) {
      if (changeInfo && changeInfo.status === 'complete') {
        chrome.storage.local.get('isRecording', items => {
          if (items.isRecording) {
            chrome.tabs.sendMessage(tabId, {text:"run record again"}, (resp) => {
              return;
            });
          }
        });
      }
    }
    else {
      return false;
    }
    });
});
