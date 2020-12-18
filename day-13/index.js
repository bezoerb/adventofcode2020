const chalk = require("chalk");
const { run } = require("../lib/utils");

run((input) => {
  const [timestamp, buslines] = input.trim().split(/[\r\n]/);
  const time = parseFloat(timestamp);
  const busIds = buslines
    .split(",")
    .filter((id) => id !== "x")
    .map((id) => parseFloat(id));

  const startTimes = busIds.map((id) => {
    const departure = Math.ceil(time / id) * id;
    const wait = departure - time;
    return {
      id,
      departure,
      wait,
      mult: id * wait,
    };
  });

  const times = [...startTimes].sort((a, b) => a.wait - b.wait);
  console.log(
    chalk.cyan(
      `What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus?`
    )
  );
  console.log(chalk.bold.green(times[0].mult));

  const busIds2 = buslines
    .split(",")
    .map((id) => parseFloat(id))
    .reduce((res, id, index) => {
      if (isNaN(id)) {
        return res;
      }

      return [...res, { id, index }];
    }, []);

  console.log(
    chalk.cyan(
      `\nWhat is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list?`
    )
  );

  console.log(chalk.cyan("Tweaked using wolframalpha. Formula:"));
  console.log(
    busIds2
      .map(
        ({ id, index }) => `x mod ${id} = ${Math.ceil(index / id) * id - index}`
      )
      .join(";")
  );

  // Result: 305068317272992
  console.log(chalk.bold.green("305068317272992"));
});
