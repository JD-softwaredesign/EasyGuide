var defaultState = {
  isRecording: false
};

chrome.storage.local.get('state', function(items) {
  if (items['state'] === undefined) {
    chrome.storage.local.set({'state': defaultState}, function() {
      alert("reset");
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  let button = document.querySelector('.btn');
  let state = {};
  chrome.storage.local.get('state', items => {
    state = items['state'];

    if (state.isRecording) {
      button.classList.add('stop');
      button.classList.remove('record');
    } else {
      button.classList.remove('stop');
      button.classList.add('record');
    }
  });

  button.addEventListener('click', (e) => {
    if (state.isRecording) {
      e.target.setAttribute('style', 'background-color: red; border-radius: 50%');
      chrome.storage.local.set({'state': { isRecording: false } });
      state.isRecording = false;
    } else {
      chrome.tabs.executeScript({file: "./lib/record.js"});
      e.target.setAttribute('style', 'background-color: black; border-radius: 0');
      chrome.storage.local.set({'state': { isRecording: true } });
      state.isRecording = true;
    }
  });
});
