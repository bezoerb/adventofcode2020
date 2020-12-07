/**
 * Get all values from source array which are also included in all other arrays
 * @param {array} source Source array
 * @param  {...any} rest Arrays to compare
 */
module.exports.intersect = (source, ...rest) =>
  source.filter((value) => rest.every((arr) => arr.includes(value)));

/**
 * Get all values from source array which are not included in any other array
 * @param {array} source Source array
 * @param  {...any} rest Arrays to compare
 */
module.exports.different = (source, ...rest) =>
  source.filter((value) => rest.every((arr) => !arr.includes(value)));

/**
 * Get the sum of all array elements
 * @param {array} arr
 * @param {number} initial
 */
module.exports.sum = (arr, initial = 0) =>
  arr.reduce((acc, val) => acc + parseFloat(val) || 0, initial);
