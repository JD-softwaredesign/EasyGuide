
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['status', 'guides'], items => {

    let ul = document.querySelector('ul');
    Object.keys(items.guides).forEach(guideName => {
      let li = document.createElement('li');
      li.innerText = guideName;
      li.addEventListener('click', (e) => {
        const guide = items.guides[guideName]

        chrome.storage.local.set({currentStep: 0, currentGuide: guide, status: "playing"});
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {text: 'play'});
        });
        window.close();
      });
      ul.appendChild(li);
    });


    let button = document.querySelector('.btn');

    if (items.status === 'recording') {
      button.classList.add('stop');
    }
    button.addEventListener('click', (e) => {
      let localStatus = items.status === 'recording' ? null : "recording";
      let message = items.status === 'recording' ? "stop" : "record";
      chrome.storage.local.set({ status: localStatus });

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {text: message });
      });
      window.close();
    });
  });

});
