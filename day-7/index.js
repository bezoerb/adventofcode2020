const fs = require("fs");
const chalk = require("chalk");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

const different = (a, b) => a.filter((x) => !b.includes(x));

const contains = (obj, ...colors) =>
  Object.keys(obj || {}).filter((color) =>
    colors.some((c) => Object.keys(obj[color]).includes(c))
  );

const containsRecursive = (obj, colors, result = []) => {
  const input = Array.isArray(colors) ? colors : [colors];
  const data = contains(obj, ...input);

  const diff = different(data, result);
  if (diff.length > 0) {
    return containsRecursive(obj, diff, [...new Set([...result, ...data])]);
  }

  return result;
};

const merge = (a, b, mult = 1) =>
  Object.keys(b).reduce((res, key) => {
    const { [key]: prev = 0 } = a;
    const { [key]: next = 0 } = b;

    return { ...res, [key]: prev + next * mult };
  }, a);

const requires = (obj, colors, initial = {}) =>
  Object.keys(colors || {}).reduce((res, color) => {
    const { [color]: mult = 1 } = colors || {};

    const { [color]: includes } = obj;

    return merge(res, includes, mult);
  }, initial);

const requiresRecursive = (obj, colors) => {
  const data = requires(obj, colors);

  if (Object.keys(data).length) {
    return merge(data, requiresRecursive(obj, data));
  }

  return data;
};

(async () => {
  const input = await readFileAsync(__dirname + "/input.txt", "utf-8");

  const rules = input
    .split(/[\r\n]/)
    .filter((v) => v)
    .reduce((rules, line) => {
      const [str, color, rule] = /^(.*)\sbags?\scontains?(.*)$/.exec(line);
      const parsed = rule.split(",").reduce((res, rule) => {
        const [, count, color] =
          /\s*(\d+)\s([\w\s]+)\sbags?\.?/.exec(rule) || [];

        return count
          ? { ...res, [color]: (res[color] || 0) + parseFloat(count) }
          : {};
      }, {});

      return { ...rules, [color]: { ...(rules[color] || {}), ...parsed } };
    }, {});

  // How many bag colors can eventually contain at least one shiny gold bag?
  console.log(
    `${chalk.green.bold(
      containsRecursive(rules, "shiny gold").length
    )} bag colors can eventually contain at least one shiny gold bag`
  );

  // How many individual bags are required inside your single shiny gold bag?
  const tmp = requiresRecursive(rules, { "shiny gold": 1 });
  console.log(
    `${chalk.green.bold(
      Object.values(tmp).reduce((acc, val) => acc + val, 0)
    )} individual bags are required inside my single shiny gold bag`
  );
})();
