const chalk = require("chalk");
const { run } = require("../lib/utils");

run((input) => {
  const commands = input.split(/[\r\n]/).map((str) => {
    const [, cmd, value] = /\s*(\w{3})\s+([-+]\d+)/.exec(str) || [];
    return { cmd, value: parseFloat(value) };
  });

  const jmpnops = commands.reduce((res, value, index) => {
    const { cmd } = value;
    if (["jmp", "nop"].includes(cmd)) {
      return [...res, index];
    }
    return res;
  }, []);

  const runs = ["test-1", ...jmpnops].map((testIndex) => {
    let visited = [];
    let index = 0;
    let acc = 0;

    while (!visited.includes(index) && index >= 0 && index < commands.length) {
      visited = [...visited, index];
      let { cmd, value } = commands[index];

      if (index === testIndex && cmd === "jmp") {
        cmd = "nop";
      } else if (index === testIndex && cmd === "nop") {
        cmd = "jmp";
      }

      switch (cmd) {
        case "jmp":
          index += value;
          break;
        case "acc":
          index++;
          acc += value;
          break;
        case "nop":
          index++;
          break;
      }
    }

    return {
      testIndex,
      acc,
      index,
    };
  });

  // 1
  console.log(`The result for part 1 is: ${chalk.green.bold(runs[0].acc)}`);

  // 2
  const tmp = runs.find((data) => data.index >= commands.length - 1);
  if (tmp) {
    console.log(
      `The result for part 2 is: ${chalk.green.bold(
        tmp.acc
      )}. Changed command at index ${tmp.testIndex} (${
        commands[tmp.testIndex].cmd
      } ${commands[tmp.testIndex].value})`
    );
  }
});
