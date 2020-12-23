const { run, ask, answer } = require("../lib/utils");
const { sum } = require("../lib/array");

const mult = (a, b) => parseFloat(a) * parseFloat(b);
const add = (a, b) => parseFloat(a) + parseFloat(b);

const evaluate = (expression) => {
  while (expression.includes("(")) {
    const match = /\(([^()]+)\)/.exec(expression);
    expression = expression.replace(match[0], evaluate(match[1]).value);
  }

  while (expression.includes("+") && !/^\d+\s*\+\s*\d+$/.test(expression)) {
    const match = /\d+\s*\+\s*\d+/.exec(expression);
    expression = expression.replace(match[0], evaluate(match[0]).value);
  }

  const [initial, ...rest] = expression.split(" ");

  return rest.reduce(
    (res, next) => {
      const { op, value } = res;
      if (op && /\d+/.test(next)) {
        switch (op) {
          case "+":
            return { value: add(next, value) };
          case "*":
            return { value: mult(next, value) };
        }
      } else {
        return { value, op: next };
      }
    },
    { value: initial }
  );
};

run((input) => {
  //   input = `1 + (2 * 3) + (4 * (5 + 6))
  // 2 * 3 + (4 * 5)
  // 5 + (8 * 3 + 9 + 3 * 4 * 3)
  // 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
  // ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`;

  const expressions = input.split(/[\r\n]/);

  const values = expressions.map((expression) => evaluate(expression).value);
  console.log(values);

  ask(
    `Evaluate the expression on each line of the homework; what is the sum of the resulting values?`
  );
  answer(sum(values, BigInt(0)));
});
