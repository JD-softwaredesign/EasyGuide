const recordHandler = (e) => {
  chrome.storage.local.get('targets', items => {
    chrome.storage.local.set({targets: items.targets.concat(e.target.outerHTML) });
  });
};

const stopHandler = () => {
  chrome.storage.local.get('targets', items => {
    chrome.storage.local.set({'guides': {name: items.targets} })
  });
  chrome.storage.local.set({'targets': []})
};
