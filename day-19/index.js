const { run, ask, answer } = require("../lib/utils");

const parseRules = (input, part) => {
  const rules = input.split(/[\r\n]/).reduce((result, row) => {
    let [, index, rule] = /(\d+):\s+(.*)/.exec(row);

    /* PART 2
       Change rule 8 & 11
    */
    if (part === 2 && index === "8") {
      rule = `(${rule})+`;
    }

    if (part === 2 && index === "11") {
      rule = Array.from(Array(20).keys())
        .map(
          (i) =>
            `${Array(i + 1)
              .fill("42")
              .join(" ")} ${Array(i + 1)
              .fill("31")
              .join(" ")}`
        )
        .join(" | ");
    }
    return { ...result, [index]: rule };
  }, {});

  const resolve = (index) => {
    const value = rules[index];
    const [, char] = /^"([a-zA-Z]+)"$/.exec(value) || [];
    if (char) {
      return char;
    }

    if (!value) {
      return console.log("FAIL:", index);
    }

    return value
      .replace(/\d+/g, (match) => {
        return `(?:${resolve(parseInt(match, 10))})`;
      })
      .replace(/\s+/g, "");
  };

  return new RegExp(`^${resolve(0)}$`, "gm");
};

run((input) => {
  //   input = `0: 4 1 5
  // 1: 2 3 | 3 2
  // 2: 4 4 | 5 5
  // 3: 4 5 | 5 4
  // 4: "a"
  // 5: "b"

  // ababbb
  // bababa
  // abbbab
  // aaabbb
  // aaaabbb`;

  const [rulesInput, messageInput] = input
    .trim()
    .split(/[\r\n]{2}/)
    .map((v) => v.trim());

  // console.log(rulesInput);
  // console.log(messageInput);
  const regexp1 = parseRules(rulesInput, 1);
  const regexp2 = parseRules(rulesInput, 2);

  ask(`How many messages completely match rule 0?`);
  answer((messageInput.match(regexp1) || []).length);

  ask(
    `After updating rules 8 and 11, how many messages completely match rule 0?`
  );
  answer((messageInput.match(regexp2) || []).length);
});
