const chalk = require("chalk");
const { run } = require("../lib/utils");
const { sum } = require("../lib/array");

const dec2bin = (dec) => (parseFloat(dec) >>> 0).toString(2);
const bin2dec = (bin) => parseInt("" + bin, 2);

const replaceAt = (str, i, replacement) =>
  str.slice(0, parseFloat(i)) + replacement + str.slice(parseFloat(i) + 1);

const applyMask = (value, mask = {}, bits) =>
  bin2dec(
    Object.keys(mask).reduce(
      (res, index) => replaceAt(res, index, mask[index]),
      dec2bin(value).padStart(bits, "0")
    )
  );

const getIndices = (index, mask = {}, bits) => {
  const indexBin = dec2bin(index).padStart(bits, "0");
  return Object.keys(mask)
    .reduce(
      (res, key) => {
        return res.flatMap((bin) =>
          mask[key].map((bit) => replaceAt(bin, key, bit))
        );
      },
      [indexBin]
    )
    .map((bin) => bin2dec(bin));
};

run((input) => {
  const memory = input.split("mask = ").reduce((res, commands) => {
    const [mask, ...instructions] = commands
      .trim()
      .split(/[\r\n]/)
      .map((val) => {
        if (val.startsWith("mem")) {
          const [, index, value] = /mem\[(\d+)\]\s*=\s*(\d+)/.exec(val);
          return { index, value: parseFloat(value) };
        }

        return val;
      });

    const maskFields = mask.split("").reduce((res, val, index) => {
      if (val === "X") {
        return res;
      }

      return { ...res, [index]: val };
    }, {});

    return instructions.reduce((res, { index, value }) => {
      const maskedValue = applyMask(value, maskFields, mask.length);
      return { ...res, [index]: maskedValue };
    }, res);
  }, {});

  console.log(
    chalk.cyan(
      "What is the sum of all values left in memory after it completes? "
    )
  );
  console.log(sum(Object.values(memory), BigInt(0)));

  const memory2 = input.split("mask = ").reduce((res, commands) => {
    const [mask, ...instructions] = commands
      .trim()
      .split(/[\r\n]/)
      .map((val) => {
        if (val.startsWith("mem")) {
          const [, index, value] = /mem\[(\d+)\]\s*=\s*(\d+)/.exec(val);
          return { index, value: parseFloat(value) };
        }

        return val;
      });

    const maskFields = mask.split("").reduce((res, val, index) => {
      if (val === "0") {
        return res;
      } else if (val === "1") {
        return { ...res, [index]: ["1"] };
      }
      return { ...res, [index]: ["0", "1"] };
    }, {});

    return instructions.reduce((res, { index, value }) => {
      const indices = getIndices(index, maskFields, mask.length);
      return {
        ...res,
        ...indices.reduce((res, index) => ({ ...res, [index]: value }), {}),
      };
    }, res);
  }, {});

  console.log(
    chalk.cyan(`\nExecute the initialization program using an emulator for a version 2 decoder chip.
What is the sum of all values left in memory after it completes?`)
  );
  console.log(sum(Object.values(memory2), BigInt(0)));
});
