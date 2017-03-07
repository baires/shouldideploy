const d = new Date(); // current time
const hours = d.getHours();
const mins = d.getMinutes();
const day = d.getDay();

export const IS_FRIDAY_AFTERNOON = day === 5 && hours >= 16 && (hours < 17 || hours === 18 && mins <= 30);
export const IS_FRIDAY = day === 5;

export const getRandom = function(list) {
  return list[Math.floor((Math.random() * list.length))];
};
