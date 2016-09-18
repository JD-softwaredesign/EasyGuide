var defaultState = {
  isRecording: false
};

chrome.storage.sync.get('state', function(items) {
  if (items['state'] === undefined) {
    chrome.storage.sync.set({'state': defaultState}, function() {
      alert("reset");
    })
  }
});
