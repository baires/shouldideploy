import {
  getRandom,
  dayHelper,
} from './constants';

document.addEventListener('DOMContentLoaded', () => {

  const TEXT = document.getElementById('text');
  const BTN = document.getElementById('reload');

  const printText = function(day) {
    TEXT.innerHTML = getRandom(day);
  };

  printText(dayHelper());

  BTN.onclick = function(event) {
    printText(dayHelper());
    event.preventDefault();
  };
});
