const recordHandler = (e) => {
  chrome.storage.local.get('targets', items => {
    chrome.storage.local.set({targets: items.targets.concat(e.target) });
  });
};

const stopHandler = () => {
  chrome.storage.local.get('targets', items => {
    console.log(items);
  });
};
