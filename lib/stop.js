document.removeEventListener('click', recordHandler);
stopHandler();
chrome.storage.local.get(['guides', 'targets'], items => {
  console.log(items.guides);
  console.log(items.targets);
});
