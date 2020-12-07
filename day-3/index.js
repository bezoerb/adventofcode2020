const chalk = require("chalk");
const { run } = require("../lib/utils");

run((input) => {
  const rows = input.split(/[\r\n]/);
  const tree = "#";

  const slopes = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 },
  ];

  let trees = Array(slopes.length).fill(0);

  slopes.forEach((slope, index) => {
    let x = 0;
    for (let y = 0; y < rows.length; y += slope.y) {
      const row = rows[y].split("");

      const field = row[x];
      if (field === tree) {
        trees[index]++;
      }
      x = (x + slope.x) % row.length;
    }
  });

  const result = trees.reduce((res, val) => res * val, 1);
  console.log(`Result: ${chalk.green(result)}`);
});
