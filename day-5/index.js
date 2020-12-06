const fs = require("fs");
const chalk = require("chalk");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

(async () => {
  const input = await readFileAsync(__dirname + "/input.txt", "utf-8");
  const ids = input
    .split(/[\r\n]/)
    .filter((code) => code)
    .map((code) => {
      let colMin = 0;
      let colMax = 127;
      let rowMin = 0;
      let rowMax = 7;

      code.split("").forEach((i) => {
        switch (i) {
          case "B":
            colMin = colMin + Math.ceil((colMax - colMin) / 2);
            break;
          case "F":
            colMax = colMin + Math.floor((colMax - colMin) / 2);
            break;
          case "R":
            rowMin = rowMin + Math.ceil((rowMax - rowMin) / 2);
            break;
          case "L":
            rowMax = rowMin + Math.floor((rowMax - rowMin) / 2);
            break;
        }
      });

      // min & max values should be equal now
      if (colMin !== colMax || rowMin !== rowMax) {
        console.log({ code, rowMin, rowMax, colMin, colMax });
        throw new Error(":-(");
      }

      return colMin * 8 + rowMin;
    });

  // a) What is the highest seat ID on a boarding pass?
  console.log(`Highest seat ID: ${chalk.green.bold(Math.max(...ids))}`);

  // b) What's your seat ID
  const sorted = [...ids].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (i < sorted.length - 1 && sorted[i] === sorted[i + 1] - 2) {
      console.log(`Your seat ID: ${chalk.green.bold(sorted[i] + 1)}`);
    }
  }
})();
