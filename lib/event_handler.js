const recordHandler = (e) => {
  chrome.storage.local.get('targets', items => {
    chrome.storage.local.set({targets: items.targets.concat(e.target.outerHTML) });
  });
};

const stopHandler = () => {
  chrome.storage.local.get(['targets', 'guides'], items => {
    let newName = `guide ${Object.keys(items.guides).length + 1}`;
    items.guides[newName] = items.targets;
    chrome.storage.local.set({'guides': items.guides });
  });
  chrome.storage.local.set({'targets': []});
};
