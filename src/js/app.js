import {
  getRandom,
  dayHelper,
  IS_FRIDAY,
} from './constants';

import '../css/styles.css'; 
  
document.addEventListener('DOMContentLoaded', () => {
  
  const TEXT = document.getElementById('text');
  const BTN = document.getElementById('reload');
  const BODY = document.getElementsByTagName('body')[0];
  
  if (IS_FRIDAY) {
    BODY.classList.add('its-friday');
  }
  
  const printText = function(day) {
    TEXT.innerHTML = getRandom(day);
  };
  
  printText(dayHelper());
  
  BTN.onclick = function(event) {
    printText(dayHelper());
    event.preventDefault();
  };
});
  