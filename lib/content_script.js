chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    switch (request.text) {
      case "record":
        window.addEventListener('mousedown', recordHandler);
        break;
      case "stop":
        window.removeEventListener('mousedown', recordHandler);
        stopHandler();
        break;
      case "play":
        guideHandler();
        break;
      default:
      sendResponse({type: "working"});
    }
});

const recordHandler = (e) => {
  chrome.storage.local.get('recordTargets', items => {
    let elementData;
    if (items.recordTargets.length === 0) {
      elementData = window.location.href;
    } else {
      elementData = {id: e.target.id,
                         classList: Array.from(e.target.classList),
                         tagName: e.target.tagName,
                         innerHTML: e.target.innerHTML};
    }
    chrome.storage.local.set({recordTargets: items.recordTargets.concat([elementData]) });
  });
};

const stopHandler = () => {
  chrome.storage.local.get(['recordTargets', 'guides'], items => {
    let newName = `guide ${Object.keys(items.guides).length + 1}`;
    newName = window.prompt("Please enter the guide name", newName);
    if (newName) {
      items.guides[newName] = items.recordTargets;
      chrome.storage.local.set({guides: items.guides });
    }
  });
  chrome.storage.local.set({recordTargets: [], status: null});
};

const guideHandler = () => {
  chrome.storage.local.get(['currentGuide', 'currentStep'], items => {
    const { currentGuide, currentStep } = items;

    if (currentStep === 0) {
      location.replace(currentGuide[currentStep]);
      chrome.storage.local.set({currentStep: currentStep + 1});
      return;
    }

    if (currentStep === currentGuide.length) {
      chrome.storage.local.set({currentStep: 0, currentGuide: null, status: null});

      return;
    }

    let searchData = currentGuide[currentStep];
    const { id, classList, tagName, innerHTML } = searchData;
    let matchedEl;
    let joinedClassList = classList.length ?  "." + classList.join("."): "";

    if (document.getElementById(id)) {
      matchedEl = document.getElementById(id);
    } else if (classList.length && document.querySelectorAll(joinedClassList).length) {
      let classMatched = Array.from(document.querySelectorAll(joinedClassList));
      classMatched = classMatched.filter( t => {
        return t.innerHTML === innerHTML;
      });
      matchedEl = classMatched[0];
    } else {
      let tagMatched = Array.from(document.querySelectorAll(tagName));
      tagMatched = tagMatched.filter( t => {
        return t.innerHTML === innerHTML;
      });
      matchedEl = tagMatched[0];
    }

    if (currentStep < currentGuide.length && matchedEl) {
      matchedEl.classList.add('guide_highlight');
      chrome.storage.local.set({currentStep: currentStep + 1});
      addEventListenerOnce(matchedEl, 'mousedown', guideHandler);
    }
  });
};

const addEventListenerOnce = (element, event, fn) => {
  let func = function () {
    element.removeEventListener(event, func);
    element.classList.remove('guide_highlight');
    fn();
  };
  element.addEventListener(event, func);
};
