
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['status', 'guides'], items => {

    let ul = document.querySelector('ul');
    Object.keys(items.guides).forEach(guideName => {
      let div = document.createElement('div');
      let li = document.createElement('li');
      const guide = items.guides[guideName];
      li.title = guideName;
      if (guideName.length > 15) {
        li.innerText = guideName.slice(0, 18) + '...';
      } else {
        li.innerText = guideName;
      }
      li.addEventListener('click', (e) => {
        chrome.storage.local.set({currentStep: 0, currentGuide: guide, status: 'playing'});
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {text: 'play'});
        });
        window.close();
      });

      let del = document.createElement('div');
      del.addEventListener('click', (e) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {text: 'delete', guideName: guideName});
        });
        window.close();
      });
      del.innerHTML = 'X';
      div.appendChild(li);
      div.appendChild(del)
      ul.appendChild(div);
    });


    let button = document.querySelector('.btn');

    if (items.status === 'recording') {
      button.classList.add('stop');
    }
    button.addEventListener('click', (e) => {
      let localStatus = items.status === 'recording' ? null : 'recording';
      let message = items.status === 'recording' ? 'stop' : 'record';
      chrome.storage.local.set({ status: localStatus });

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {text: message });
      });
      window.close();
    });
  });

});
