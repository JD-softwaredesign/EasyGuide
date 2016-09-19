document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('isRecording', items => {
    let button = document.querySelector('.btn');

    if (items.isRecording) {
      button.classList.add('stop');
      button.classList.remove('record');
    } else {
      button.classList.remove('stop');
      button.classList.add('record');
    }

    button.addEventListener('click', (e) => {
      if (items.isRecording) {
        chrome.tabs.executeScript({file: "./lib/stop.js"})
        e.target.setAttribute('style', 'background-color: red; border-radius: 50%');
        chrome.storage.local.set({ isRecording: false });
      } else {
        chrome.tabs.executeScript({file: "./lib/record.js"});
        e.target.setAttribute('style', 'background-color: black; border-radius: 0');
        chrome.storage.local.set({ isRecording: true });
        window.close()
      }
    });
  });

});
