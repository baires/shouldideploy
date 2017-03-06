const d = new Date(); // current time
const hours = d.getHours();
const mins = d.getMinutes();
const day = d.getDay();

const fire = day === 5 && hours >= 16 && (hours < 18 || hours === 18 && mins <= 30);

const itemsYes = [
  'I don\'t see why not',
  'It\'s a free country',
  'Go ahead my friend!',
  'Go for it',
  'Go go go go!',
  'Let\'s do it!',
];

const itemsNo = ['Nope', 'Ni', 'Ni en pedo'];

const getRandom = function (list) {
  return list[Math.floor((Math.random() * list.length))];
};

document.addEventListener('DOMContentLoaded', () => {

  const el = document.getElementById('text');

  if (fire) {
    el.innerHTML = getRandom(itemsNo);
  }
  el.innerHTML = getRandom(itemsYes);

});
