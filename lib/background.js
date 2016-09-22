
chrome.storage.local.set({status: null, recordTargets: [], guides: {}, currentGuide: [], currentStep: null}, () => {
  alert("reset");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id === tabId) {
      if (changeInfo && changeInfo.status === 'complete') {
        chrome.storage.local.get(['status'], items => {
          if (items.status === "recording") {
            chrome.tabs.sendMessage(tabId, {text:"record"});
          }
          else if (items.status === "playing") {
            chrome.tabs.sendMessage(tabId, {text:"play"});
          }
        });
      }
    }
    else {
      return false;
    }
    });
});
