import {
  REASONS_TO_DEPLOY,
  REASONS_TO_NOT_DEPLOY,
  REASONS_FOR_FRIDAY_AFTERNOON,
} from './reasons';

const D = new Date();
const HOURS = D.getHours();
const MINS = D.getMinutes();
const DAY = D.getDay();

export const IS_FRIDAY_AFTERNOON = DAY === 5 && HOURS >= 16 && (HOURS < 17 || HOURS === 18 && MINS <= 30);
export const IS_FRIDAY = DAY === 5;

export const getRandom = function(list) {
  return list[Math.floor((Math.random() * list.length))];
};

export   function dayHelper(){
  if (IS_FRIDAY) {
    return REASONS_TO_NOT_DEPLOY;
  } else if (IS_FRIDAY_AFTERNOON) {
    return REASONS_FOR_FRIDAY_AFTERNOON;
  }
  return REASONS_TO_DEPLOY;
}
