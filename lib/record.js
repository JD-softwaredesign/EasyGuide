var record = record || function record() {
  this.clickTargets = [];
};

record.prototype.start = function() {
  console.log("started");
  document.addEventListener("click", (e) => {
    this.clickTargets.push(e.target);
    console.log(e.target);
  });
};

record.prototype.stop = function() {
  console.log("stopped");
  console.log(this.clickTargets);
  //run saving script
};

var r = new record;
r.start();

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log("something's changing");
  if (changes.state.oldValue.isRecording && !changes.state.newValue.isRecording) {
    r.stop();
  }
});
