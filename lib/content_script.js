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
      case "delete":
        deleteGuideHandler(request.guideName);
        break;
      default:
      sendResponse({type: "working"});
    }
});

const deleteGuideHandler = (guideName) => {
  if (window.confirm(`Are you sure you want to delete [${guideName}]?`)) {
    chrome.storage.local.get('guides', items => {
      let newGuides = items.guides;
      delete newGuides[guideName];
      chrome.storage.local.set({guides: newGuides});
    });
  }
};

const recordHandler = (e) => {
  chrome.storage.local.get('recordTargets', items => {
    if (items.recordTargets.length === 0) {
      chrome.storage.local.set({recordTargets: items.recordTargets.concat([window.location.href])});
      recordHandler(e);
      return;
    }
    let elementData = {id: e.target.id,
                     classList: Array.from(e.target.classList),
                     tagName: e.target.tagName,
                     innerHTML: e.target.innerHTML};
    chrome.storage.local.set({recordTargets: items.recordTargets.concat([elementData])});
  });
};

const stopHandler = () => {
  chrome.storage.local.get(['recordTargets', 'guides'], items => {
    let newName = `guide ${Object.keys(items.guides).length + 1}`;
    newName = window.prompt("Please enter the guide name", newName);
    if (newName) {
      items.guides[newName] = items.recordTargets;
      chrome.storage.local.set({guides: items.guides});
    }
  });
  chrome.storage.local.set({recordTargets: [], status: null});
};

const guideHandler = () => {
  chrome.storage.local.get(['currentGuide', 'currentStep'], items => {
    let { currentGuide, currentStep } = items;
    if (currentStep === 0) {
      chrome.storage.local.set({currentStep: currentStep + 1});
      location.replace(currentGuide[currentStep]);
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
      addEventListenerOnce(matchedEl, 'mousedown', guideHandler);

      let canvas = document.createElement('canvas');
      let body = document.querySelector('body');
      let ctx = canvas.getContext('2d');
      let rect = matchedEl.getBoundingClientRect();
      let top = rect.top + window.scrollY;
      let left = rect.left + window.scrollX;
      canvas.width = body.scrollWidth;
      canvas.height = body.scrollHeight;
      canvas.id = 'easyguide-canvas';
      canvas.setAttribute('style', 'background: rgba(0, 0, 0, 0.2); pointer-events: none; position: absolute; top: 0; left: 0;');
      body.appendChild(canvas);
      document.addEventListener('mousemove', drawStroke.bind(null, ctx, canvas, matchedEl, left, top));

      // needs matchedEl's document position
      // needs to somehow remove mousemove event handler
      // on the document when matchedEl click happens
      // Also remove canvas when it's done
    }
  });
};

const drawStroke = (ctx, canvas, matchedEl, left, top) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(event.pageX, event.pageY);
  ctx.stroke();
};

const addEventListenerOnce = (element, event, fn) => {
  let func = function () {
    chrome.storage.local.get('currentStep', items => {
      chrome.storage.local.set({currentStep: items.currentStep + 1}, () => {
        element.removeEventListener(event, func);
        element.classList.remove('guide_highlight');
        fn();
      });
    });
  };
  element.addEventListener(event, func);
};
