const fs = require("fs");
const chalk = require("chalk");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);
const intersect = (arr) =>
  arr[0].filter((v) => arr.slice(1).every((a) => a.includes(v)));

(async () => {
  const input = await readFileAsync(__dirname + "/input.txt", "utf-8");
  const groups = input.split(/[\r\n]{2}/);

  // For each group, count the number of questions to which anyone answered "yes".
  // What is the sum of those counts?
  const a = groups.map((row) => {
    const answers = Array.from(Array(26)).map((_, index) =>
      row.includes(String.fromCharCode(97 + index)) ? 1 : 0
    );
    return sum(answers);
  });

  console.log(`Sum (anyone): ${chalk.green.bold(sum(a))}`);

  // For each group, count the number of questions to which everyone answered "yes".
  // What is the sum of those counts?
  const b = groups.map((row) => {
    const intersected = intersect(
      row
        .split(/[\r\n]/)
        .filter((line) => line)
        .map((line) => line.split(""))
    );
    const answers = Array.from(Array(26)).map((_, index) =>
      intersected.includes(String.fromCharCode(97 + index)) ? 1 : 0
    );
    return sum(answers);
  });
  console.log(`Sum (everyone): ${chalk.green.bold(sum(b))}`);
})();
