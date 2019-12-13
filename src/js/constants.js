import {
  REASONS_TO_DEPLOY,
  REASONS_TO_NOT_DEPLOY,
  REASONS_FOR_FRIDAY_AFTERNOON,
  REASONS_FOR_AFTERNOON,
  REASONS_FOR_WEEKEND,
} from './reasons';

const D = new Date();
const HOURS = D.getHours();
const DAY = D.getDay();

export const IS_FRIDAY = DAY === 5;
export const IS_AFTERNOON = HOURS >= 15;
export const IS_FRIDAY_AFTERNOON = IS_FRIDAY && IS_AFTERNOON;
export const IS_WEEKEND = DAY > 5;

export const getRandom = function(list) {
  return list[Math.floor(Math.random() * list.length)];
};

export function dayHelper() {
  if (IS_FRIDAY_AFTERNOON) {
    return REASONS_FOR_FRIDAY_AFTERNOON;
  }
  if (IS_FRIDAY) {
    return REASONS_TO_NOT_DEPLOY;
  }
  if (IS_AFTERNOON) {
    return REASONS_FOR_AFTERNOON;
  }
  if (IS_WEEKEND) {
    return REASONS_FOR_WEEKEND;
  }
  return REASONS_TO_DEPLOY;
}
