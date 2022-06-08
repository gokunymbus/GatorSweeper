/**
 * Clamps a number to a min or max value.
 * 
 * @param value The number to check the min and max against.
 * @param min The min number returned if the value is less.
 * @param max the max number returned if the value is more. 
 * 
 * @example
 *  const value = 987;
 *  const min = 5;
 *  const max = 40;
 *  const clampedValue = Clamp(value, min, max);
 *  console.log(clampedValue) // 40
 */
export default function Clamp(value, min, max) {
    if (value < min) {
        return min;
    }

    if ( value > max) {
        return max;
    }

    return value;
}