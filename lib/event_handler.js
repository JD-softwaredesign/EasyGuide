chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.text == "run record again") {
      window.addEventListener('mousedown', recordHandler);
      sendResponse({type: "test"});
    }
});

const recordHandler = (e) => {
  console.log(e.target);
  chrome.storage.local.get('targets', items => {
    let elementData = [e.target.id,
                       Array.from(e.target.classList),
                       e.target.tagName, e.target.innerHTML];
    chrome.storage.local.set({targets: items.targets.concat([elementData]) });
  });
};

const stopHandler = () => {
  chrome.storage.local.get(['targets', 'guides'], items => {
    let newName = `guide ${Object.keys(items.guides).length + 1}`;
    newName = window.prompt("Please enter the guide name", newName);
    if (newName) {
      items.guides[newName] = items.targets;
      chrome.storage.local.set({'guides': items.guides });
    }
  });
  chrome.storage.local.set({'targets': []});
};

const guideHandler = (idx, prevTarget) => {
  if (prevTarget) {
    prevTarget.setAttribute('style', 'background: inherit');
  }

  chrome.storage.local.get('currentGuide', items => {
    console.log(items);
    if (idx === items.currentGuide.length) {
      return;
    }
    let element = items.currentGuide[idx];
    let currentTarget;
    let classList = element[1].length ?  "." + element[1].join("."): "";
    if (document.getElementById(element[0])) {
      currentTarget = document.getElementById(element[0]);
    } else if (classList.length && document.querySelectorAll(classList).length) {
      let classTargets = Array.from(document.querySelectorAll(classList));
      classTargets = classTargets.filter( t => {
        return t.innerHTML === element[3];
      });
      currentTarget = classTargets[0];
    } else {
      let tagTargets = Array.from(document.querySelectorAll(element[2]));
      tagTargets = tagTargets.filter( t => {
        return t.innerHTML === element[3];
      });
      currentTarget = tagTargets[0];
    }

    if (!currentTarget) {
      guideHandler(idx, prevTarget);
      return;
    }

    if (items.currentGuide.length > idx) {
      currentTarget.setAttribute('style', 'background: green');
      currentTarget.addEventListener('mousedown', guideHandler.bind(null, idx + 1, currentTarget));
    }
  });
};
