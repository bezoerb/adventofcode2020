const chalk = require("chalk");
const { run, ask, answer } = require("../lib/utils");
const { sum, different, multiply } = require("../lib/array");

const isBetween = (num, min, max) => {
  const valid =
    parseInt(num, 10) >= parseInt(min, 10) &&
    parseInt(num, 10) <= parseInt(max, 10);
  return valid;
};

const checkRule = (num, [min1, max1, min2, max2]) =>
  isBetween(num, min1, max1) || isBetween(num, min2, max2);

const validate = (row, rules) => {
  const numbers = row.trim().split(",");
  return numbers.filter((num) => {
    return !rules.some((rule) => checkRule(num, rule));
  });
};

const reducePosibilities = (possibilities) => {
  const singles = Object.values(possibilities)
    .filter((v) => v.length === 1)
    .flat();

  possibilities = Object.keys(possibilities).reduce((res, key) => {
    const { [key]: value } = possibilities;
    if (possibilities[key].length > 1) {
      return { ...res, [key]: different(value, singles) };
    }
    return { ...res, [key]: value };
  }, {});

  return possibilities;
};

const detectPositions = (row, rules, initial = {}) => {
  const numbers = row.trim().split(",");
  const possibilities = rules.reduce((res, rule) => {
    const { name, values } = rule;
    const { [name]: possibilities = Array.from(numbers.keys()) } = res;

    const checked = possibilities.filter((index) =>
      checkRule(numbers[index], values)
    );

    return { ...res, [name]: checked };
  }, initial);

  return possibilities;
};

run((input) => {
  //   input = `class: 0-1 or 4-19
  // row: 0-5 or 8-19
  // seat: 0-13 or 16-19

  // your ticket:
  // 11,12,13

  // nearby tickets:
  // 3,9,18
  // 15,1,5
  // 5,14,9`;
  let [rulesGroup, yourGroup, nearbyGroup] = input.trim().split(/[\r\n]{2}/);

  const rules = rulesGroup.split(/[\r\n]/).map((str) => {
    const [
      ,
      name,
      min1,
      max1,
      min2,
      max2,
    ] = /^([^:]+):\s(\d+)-(\d+)\s+or\s+(\d+)-(\d+)/.exec(str);
    return { name, values: [min1, max1, min2, max2] };
  });

  const [, you] = yourGroup.split(/[\r\n]/);
  const [, ...nearby] = nearbyGroup.split(/[\r\n]/);

  const ruleValues = rules.map((rule) => rule.values);

  const fails = nearby.map((row) => validate(row, ruleValues)).flat();
  ask(`Consider the validity of the nearby tickets you scanned.
What is your ticket scanning error rate?`);
  answer(sum(fails));

  // part two
  const valid = nearby.filter((row) => validate(row, ruleValues).length === 0);

  const positions = valid.reduce((res, row) => {
    return detectPositions(row, rules, res);
  }, {});

  let tmp = positions;
  let i = 0;
  const check = (data) =>
    Object.keys(data).length === sum(Object.values(data).map((v) => v.length));

  // bit hacky ;)
  while (i < 100 && !check(tmp)) {
    tmp = reducePosibilities(tmp);
    i++;
  }

  const values = Object.keys(tmp)
    .filter((key) => /departure/.test(key))
    .map((key) => {
      const [val] = tmp[key];
      return you.split(",")[val];
    });

  ask(`Once you work out which field is which, look for the six fields on your ticket that start with the word departure.
What do you get if you multiply those six values together?`);

  answer(multiply(values));
});
