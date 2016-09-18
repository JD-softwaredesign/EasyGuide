import Record from './record.js';
let isRecording = false;

document.addEventListener('DOMContentLoaded', () => {
  let button = document.querySelector('.btn');
  button.addEventListener('click', (e) => {
    if (isRecording) {
      // stopRecord();
      isRecording = false;
      e.target.setAttribute('style', 'background-color: red; border-radius: 50%');
    } else {
      let record = new Record();
      console.log(record);
      // startRecord();
      isRecording = true;
      e.target.setAttribute('style', 'background-color: black; border-radius: 0');
    }
  });
  // add lists from local storage
  // implement record class and generate new when user clicks record.
  // store record in local storage
});
