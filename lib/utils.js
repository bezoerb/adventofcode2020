const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const callsite = require("callsite");
const readFileAsync = promisify(fs.readFile);

module.exports.run = async (callback = () => true) => {
  const stack = callsite();
  const [, tmp] = stack || [];

  if (!tmp) {
    throw new Error("Could not be called directly");
  }

  try {
    const root = path.dirname(tmp.getFileName());
    const input = await readFileAsync(root + "/input.txt", "utf-8");
    await callback(input);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
