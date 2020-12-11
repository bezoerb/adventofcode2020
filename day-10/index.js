const chalk = require("chalk");
const { run } = require("../lib/utils");
const { sum } = require("../lib/array");

run((input) => {
  const numbers = input
    .trim()
    .split(/[\r\n]/)
    .map((val) => parseFloat(val))
    .sort((a, b) => a - b);

  const device = numbers[numbers.length - 1] + 3;

  const diff = [...numbers, device].reduce(
    (res, current, i, array) => {
      const last = array[i - 1] || 0;
      const diff = current - last;
      if (!current)
        if (diff > res.length) {
          throw new Error("Difference needs to be 1, 2 or 3");
        }

      const tmp = res[diff] || [];

      return { ...res, [diff]: [...tmp, current] };
    },
    { 3: [] }
  );

  console.log(
    "What is the number of 1-jolt differences multiplied by the number of 3-jolt differences?"
  );

  console.log("1-jolt differences", chalk.green.bold(diff[1].length));
  console.log("3-jolt differences", chalk.green.bold(diff[3].length));
  console.log(chalk.green.bold(diff[1].length * diff[3].length));

  // Search streaks with a different of 1;
  const streaks = [0, ...numbers, device].reduce(
    (res, current, i, array) => {
      const prev = array[i - 1] || 0;
      const next = array[i + 1];

      if (next === undefined) {
        return res;
      }

      if (current - prev <= 1) {
        res[res.length - 1].push(current);
        return res;
      }
      return [...res, [current]];
    },
    [[]]
  );

  // calculate number of possibilities for each streak
  const possibilitiyArray = streaks.map((streak) => {
    const length = streak.slice(1, streak.length - 1).length;

    // Find the number of possibilities combining the numbers in the streak
    const pow = Math.pow(2, length);
    // for a streak with length > 2 we have to make sure to skip the possibility of "none of them"
    if (length > 2) {
      return pow - 1;
    }

    return pow;
  });

  // multiply the possibilities
  const possibilities = possibilitiyArray.reduce((res, val) => res * val, 1);

  console.log(
    "\nWhat is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?"
  );
  console.log(chalk.green.bold(possibilities));
});
