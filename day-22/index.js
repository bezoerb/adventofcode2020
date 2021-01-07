const { run, ask, answer } = require("../lib/utils");
const { sum } = require("../lib/array");

const calculateScore = (...arr) => {
  const cards = [...arr].flat();
  return sum(cards.map((num, index) => num * (cards.length - index)));
};

const play = (c1, c2) => {
  let cards1 = [...c1];
  let cards2 = [...c2];
  while (cards1.length && cards2.length) {
    const [p1, ...rest1] = cards1;
    const [p2, ...rest2] = cards2;

    if (p1 > p2) {
      cards1 = [...rest1, p1, p2];
      cards2 = [...rest2];
    } else {
      cards1 = [...rest1];
      cards2 = [...rest2, p2, p1];
    }
  }

  return [cards1, cards2];
};

const playRecursive = (c1, c2) => {
  let cards1 = [...c1];
  let cards2 = [...c2];
  let played1 = [];
  let played2 = [];
  while (cards1.length && cards2.length) {
    const check1 = cards1.join("-");
    const check2 = cards2.join("-");

    const [p1, ...rest1] = cards1;
    const [p2, ...rest2] = cards2;

    // Condition
    if (played1.includes(check1) && played2.includes(check2)) {
      cards2 = [];
      break;
    }

    let winner = p1 > p2 ? 1 : 2;

    if (p1 <= rest1.length && p2 <= rest2.length) {
      const [r1, r2] = playRecursive(rest1.slice(0, p1), rest2.slice(0, p2));
      winner = r1.length > r2.length ? 1 : 2;
    }

    if (winner === 1) {
      cards1 = [...rest1, p1, p2];
      cards2 = [...rest2];
    } else {
      cards1 = [...rest1];
      cards2 = [...rest2, p2, p1];
    }

    played1 = [...played1, check1];
    played2 = [...played2, check2];
  }

  return [cards1, cards2];
};

run((input) => {
  const [p1, p2] = input
    .trim()
    .split(/[\r\n]{2}/)
    .map((player) => {
      const [name, ...cards] = player.split(/[\r\n]/);

      return { name, cards: cards.map((num) => parseFloat(num)) };
    });

  ask("What is the winning player's score?");
  answer(calculateScore(...play(p1.cards, p2.cards)));

  ask("What is the winning player's score (recursive)?");
  answer(calculateScore(...playRecursive(p1.cards, p2.cards)));
}, "input.txt");
