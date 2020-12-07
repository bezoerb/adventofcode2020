const chalk = require("chalk");
const { run } = require("../lib/utils");
const { intersect } = require("../lib/array");

run((input) => {
  const rows = input.split(/[\r\n]{2}/).map((row) => {
    let data = {};
    row.replace(/([^:]+):([^\s]+)/g, (str, key, value) => {
      data[key.trim()] = value;
      return str;
    });

    const keys = Object.keys(data);
    const { byr, iyr, eyr, hgt, hcl, ecl, pid } = data;

    /*
      A:
      byr (Birth Year)
      iyr (Issue Year)
      eyr (Expiration Year)
      hgt (Height)
      hcl (Hair Color)
      ecl (Eye Color)
      pid (Passport ID)
    */
    const required = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
    const fieldsValid = intersect(required, keys).length === required.length;

    /*
      B:
      byr (Birth Year) - four digits; at least 1920 and at most 2002.
      iyr (Issue Year) - four digits; at least 2010 and at most 2020.
      eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
      hgt (Height) - a number followed by either cm or in:
      If cm, the number must be at least 150 and at most 193.
      If in, the number must be at least 59 and at most 76.
      hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
      ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
      pid (Passport ID) - a nine-digit number, including leading zeroes.
      cid (Country ID) - ignored, missing or not.
    */

    const byrValid = parseFloat(byr) >= 1920 && parseFloat(byr) <= 2002;
    const iyrValid = parseFloat(iyr) >= 2010 && parseFloat(iyr) <= 2020;
    const eyrValid = parseFloat(eyr) >= 2020 && parseFloat(eyr) <= 2030;
    const [, height, unit] = /^(\d+)(cm|in)$/.exec(hgt || "") || [];
    const hgtValid =
      (unit === "cm" &&
        parseFloat(height) >= 150 &&
        parseFloat(height) <= 193) ||
      (unit === "in" && parseFloat(height) >= 59 && parseFloat(height) <= 76);
    const hclValid = /^\#[0-9a-f]{6}$/.test(hcl);
    const eclValid = /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(ecl);
    const pidValid = /^\d{9}$/.test(pid);

    return (
      fieldsValid &&
      byrValid &&
      iyrValid &&
      eyrValid &&
      hgtValid &&
      hclValid &&
      eclValid &&
      pidValid
    );
  });

  console.log(`${chalk.green.bold(rows.filter((v) => v).length)} valid`);
});
