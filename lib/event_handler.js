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

const guideHandler = () => {
  chrome.storage.local.get('currentGuide', items => {
    let currentTargets = [];
    items.currentGuide.forEach( element => {
      if (element[0]) {
        currentTargets.push(document.querySelector("#" + element[0]));
      } else if (element[1].length) {
        let classList = "." + element[1].join(".");
        let classTargets = Array.from(document.querySelectorAll(classList));
        classTargets = classTargets.filter( t => {
          return t.innerHTML === element[3];
        });
        currentTargets.push(classTargets[0]);
      } else {
        let tagTargets = Array.from(document.querySelectorAll(element[2]));
        tagTargets = tagTargets.filter( t => {
          return t.innerHTML === element[3];
        });
        currentTargets.push(tagTargets[0]);
      }
    });

    guide(currentTargets, 0);
  });
};

const guide = (targets, idx) => {
  if (targets.length > idx) {
    targets[idx].setAttribute('style', 'background: green');
    targets[idx].addEventListener('click', targetHelper.bind(null, targets, idx));
  }
};

const targetHelper = (targets, idx) => {
  guide(targets, idx + 1);
};
