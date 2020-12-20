const chalk = require("chalk");
const { run } = require("../lib/utils");

run((input) => {
  input = "20,0,1,11,6,3";

  const starting = input.split(",").map((v) => parseFloat(v));
  let history = new Map();
  let last;
  for (let i = 0; i < 30000000; i++) {
    if (i < starting.length) {
      history.set(starting[i], i);
      continue;
    }
    let next;
    if (!history.has(last)) {
      next = 0;
    } else {
      next = i - 1 - history.get(last);
    }

    history.set(last, i - 1);
    last = next;
  }

  console.log(chalk.cyan(`What will be the 2020th number spoken`));
  console.log(last);
});
