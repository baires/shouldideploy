import {
  REASONS_TO_DEPLOY,
  REASONS_TO_NOT_DEPLOY,
  REASONS_FOR_FRIDAY_AFTERNOON,
} from './reasons';

const D = new Date();
const HOURS = D.getHours();
const DAY = D.getDay();

export const IS_FRIDAY = DAY === 5;
export const IS_FRIDAY_AFTERNOON = IS_FRIDAY && HOURS >= 16;

export const getRandom = function(list) {
  return list[Math.floor((Math.random() * list.length))];
};

export function dayHelper(){
  if (IS_FRIDAY_AFTERNOON) {
    return REASONS_FOR_FRIDAY_AFTERNOON;
  } else if (IS_FRIDAY) {
    return REASONS_TO_NOT_DEPLOY;
  }
  return REASONS_TO_DEPLOY;
}
