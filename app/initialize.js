const d = new Date(); // current time
const hours = d.getHours();
const mins = d.getMinutes();
const day = d.getDay();

const isFridayAfternoon = day === 5 && hours >= 16 && (hours < 17 || hours === 18 && mins <= 30);
const isFriday = day === 5;

const reasonsToDeploy = [
  'I don\'t see why not',
  'It\'s a free country',
  'Go ahead my friend!',
  'Go for it',
  'Go go go go!',
  'Let\'s do it!',
  'Ship it! 🚢',
];

const reasonsToNotDeploy = [
  'I wouldn\'t recommend it',
  'No man, it\'s Friday',
];

const reasonForFridayAfternoon = [
  'Nope',
  'Not by any chance',
  'U mad?',
  'What you are thinking?',
  'No no no no no no no no',
  'How do you feel about working nights and weekends?',
  '🔥 🚒 🚨 ⛔️ 🔥 🚒 🚨 ⛔️ 🔥 🚒 🚨 ⛔️',
];

const getRandom = function(list) {
  return list[Math.floor((Math.random() * list.length))];
};

document.addEventListener('DOMContentLoaded', () => {

  const el = document.getElementById('text');

  if (isFriday) {
    el.innerHTML = getRandom(reasonsToNotDeploy);

  } else if (isFridayAfternoon) {
    el.innerHTML = getRandom(reasonForFridayAfternoon);
  }
  el.innerHTML = getRandom(reasonsToDeploy);

});
