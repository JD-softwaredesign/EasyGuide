TODO:
Finish readme
Make a video

## EasyGuide

[Live](link goes here)

### Background

Nearly everyone experienced with technology has had the often frustrating experience of helping an less tech-savvy user navigate the web. Even power users can get lost in labyrinthine menus looking for specific settings or features. Enter EasyGuide: Simply hit record to have the extension record a series of clicks, and then save them to play back at any time, highlighting each clicked element in turn as the user walks through the steps.

[![ScreenShot](https://raw.github.com/GabLeRoux/WebMole/master/ressources/WebMole_Youtube_Video.png)](http://youtu.be/vt5fpE0bzSY)

Note: replace with actual screenshot and video


### How To Use

Install the extension from the Chrome store. Click the flag icon in your browser's toolbar, and click the red record button to start a new Guide. Navigate the web as you normally would until you've completed the task you would like to demonstrate, then click the flag icon again and click stop. You will be prompted to enter a name and save your Guide, or cancel to delete it.

Later, click the Guide name in the list of Guides to start playback. You will see your sequence of clicked items become highlighted in turn, and a green line will connect the current pointer's position with the item's position. Simply click the item to advance to the next one. When the last item is clicked, the function will terminate.

### Technical Details

This extension uses a custom HTMl DOM element matcher which matches against selectors of decreasing specificity. First, it will try to find any items with matching ID. Next, it will look for items with a matching CSS class list. Next, it will look for any items with matching HTML tags. Finally, it will compare the innerHTML to ensure the correct item was found. All of these selectors are saved in an object compromising one step of a guide. A click during recording adds a new step to the guide, and a click during playback advances the progress through the guide by one step. Upon beginning a new recording, the first step of a guide is set as the URL of the current page, and it will redirect the user to that URL upon playback.

The arrow from the pointer to the matched element is drawn on the HTML5 canvas. It is rendered using a setInterval timer in order to continually update its position as the pointer moves around the screen. To find the start position, it simply looks at the current pageX and pageY of a mousemove event and it uses the following to find the end position.

```javascript
let rect = matchedEl.getBoundingClientRect();
let top = rect.top + window.scrollY + matchedEl.scrollHeight / 2;
let left = rect.left + window.scrollX + matchedEl.scrollWidth / 2;
```
To keep event listeners from expiring upon page refresh, if a click will navigate a user to a new page during recording or playback, a background script listens for page changes and sends a message to the content script to add a new event listener to the new window.
