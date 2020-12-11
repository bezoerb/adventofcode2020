const chalk = require("chalk");
const { run } = require("../lib/utils");

const validate = (array, index, preambleLength = 25) => {
  const start = index - preambleLength;
  const end = start + preambleLength + 1;

  if (start < 0) {
    return true;
  }

  const parts = array.slice(start, end);
  const number = array[index];

  for (let i = 0; i < preambleLength; i++) {
    for (let j = 0; j < preambleLength; j++) {
      if (parts[i] + parts[j] === number) {
        return true;
      }
    }
  }

  return false;
};

const findWeakness = (array, number) => {
  const calc = (arr, index, number) => {
    let sum = 0;
    for (let i = index; i < arr.length; i++) {
      sum += arr[i];
      if (sum === number) {
        return { min: index, max: i };
      }
      if (sum > number) {
        return null;
      }
    }
    return null;
  };

  for (let i = 0; i < array.length; i++) {
    const result = calc(array, i, number);
    if (result) {
      const parts = array.slice(result.min, result.max + 1);
      const min = Math.min(...parts);
      const max = Math.max(...parts);
      return min + max;
    }
  }
};

run((input) => {
  const numbers = input.split(/[\r\n]/).map((val) => parseFloat(val));

  for (i = 0; i < numbers.length; i++) {
    const valid = validate(numbers, i);
    if (!valid) {
      console.log(numbers[i]);
      console.log(findWeakness(numbers, numbers[i]));
      process.exit(0);
    }
  }
});
