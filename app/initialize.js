import {
  IS_FRIDAY,
  IS_FRIDAY_AFTERNOON,
  getRandom,
} from './constants';

import {
  REASONS_TO_DEPLOY,
  REASONS_TO_NOT_DEPLOY,
  REASONS_FOR_FRIDAY_AFTERNOON,
} from './reasons';

document.addEventListener('DOMContentLoaded', () => {

  const el = document.getElementById('text');
  const printText = function(day) {
    el.innerHTML = getRandom(day);
  };

  if (IS_FRIDAY) {
    printText(REASONS_TO_NOT_DEPLOY);
  } else if (IS_FRIDAY_AFTERNOON) {
    printText(REASONS_FOR_FRIDAY_AFTERNOON);
  }
  printText(REASONS_TO_DEPLOY);
  
});
