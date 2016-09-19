let clickTargets = clickTargets || [];

const start = () => {
  document.addEventListener("click", (e) => {
    clickTargets.push(e.target);
  });
};

const stop = () => {
  console.log(clickTargets);
};

start();

chrome.storage.local.get('state', function(items) {
  if (items['state'].isRecording === false) {
    stop();
  }
});
