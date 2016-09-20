const recordHandler = (e) => {
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
    let element = items.currentGuide[idx];
    let currentTarget;
    let classList = "." + element[1].join(".");
    console.log("element" + element);
    if (document.getElementById(element[0])) {
      console.log("matched ID");
      currentTarget = document.getElementById(element[0]);
    } else if (document.querySelectorAll(classList).length) {
      console.log("matched class list");
      let classTargets = Array.from(document.querySelectorAll(classList));
      classTargets = classTargets.filter( t => {
        return t.innerHTML === element[3];
      });
      currentTarget = classTargets[0];
    } else {
      console.log("matched tag");
      console.log(element);
      let tagTargets = Array.from(document.querySelectorAll(element[2]));
      console.log(tagTargets);
      tagTargets = tagTargets.filter( t => {
        return t.innerHTML === element[3];
      });
      currentTarget = tagTargets[0];
    }
    if (items.currentGuide.length > idx) {
      console.log("still working" + currentTarget);
      currentTarget.setAttribute('style', 'background: green');

      currentTarget.addEventListener('mousedown', guideHandler.bind(null, idx + 1, currentTarget));
    }
  });
};
