/**
 * Determines if a number is within a given min/max range. 
 * 
 * @param {*} min The lower number in the range.
 * @param {*} max The higher number in the range.
 * @param {*} number The number to check in range. 
 * @returns {boolean} The result of the targetNumber being in range. 
 */
export default function inRange(min, max, targetNumber) {
    return targetNumber >= min && targetNumber <= max;
}
