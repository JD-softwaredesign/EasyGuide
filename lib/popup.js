document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['isRecording', 'guides'], items => {

    let ul = document.querySelector('ul');
    Object.keys(items.guides).forEach(guideName => {
      let li = document.createElement('li');
      li.innerText = guideName;
      li.addEventListener('dblclick', (e) => {
        const guide = items.guides[guideName]
        chrome.storage.local.set({currentGuide: guide});
        chrome.tabs.executeScript({file: "./lib/playback.js"});
        window.close();
      });
      ul.appendChild(li);
    });



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
        chrome.tabs.executeScript({file: "./lib/stop.js"});
        e.target.setAttribute('style', 'background-color: red; border-radius: 50%');
        chrome.storage.local.set({ isRecording: false });
        window.close();
      } else {
        chrome.tabs.executeScript({file: "./lib/record.js"});
        e.target.setAttribute('style', 'background-color: black; border-radius: 0');
        chrome.storage.local.set({ isRecording: true });
        window.close()
      }
    });
  });

});
