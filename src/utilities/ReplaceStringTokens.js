/**
 *
 * A simple function for replacing tokens in a string
 *
 * @example
 *  const string = "Yay i won {0} times and collected {1} money!"
 *  const newString = ReplaceStringToken(string, [500, '$400']);
 *
 *  console.log(newString); // "Yay i won 500 times";
 *
 * @param {string} string A string with tokens
 * @param {array} arrayOfValues An array of each value to replace in the provided string.
 * @retuns A new string containg the values, and the original string if an error occurs.
 */
export default function ReplaceStringTokens(string, arrayOfValues) {
    if (!arrayOfValues || !arrayOfValues.length) {
        return string;
    }

    return arrayOfValues.reduce((previousValue, currentValue, currentIndex) => {
        return previousValue.replace(`{${currentIndex}}`, currentValue);
    }, string);
}
