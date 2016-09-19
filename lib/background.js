var defaultState = {
  isRecording: false,
  clickTargets: []
};

chrome.storage.local.get('state', function(items) {
  if (items['state'] === undefined) {
    chrome.storage.local.set({'state': defaultState}, function() {
      alert("reset");
    });
  }
});
