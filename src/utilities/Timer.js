/**
 * A simple timer function that calls a function provided
 * on every interval provided and returns a method for stopping.
 * 
 * @param {function} callback A callback that is invoked every interval.
 * @param {number} interval The time between each funtion invocation.
 * @returns {object} A new object that contains a stop() method for 
 *  stopping the timer.
 * 
 * @example 
 * 
 * const activeTimer = timer((intervalsPassed) => {
 *  console.log(intervalsPassed + " intervals has passed") 
 * }, 1000);
 * 
 * setTimeout(() => {
 *  activeTimer.stop();
 * }, 5001);
 * 
 * // Expected output to console
 * // 1 intervals has passed
 * // 2 intervals has passed
 * // 3 intervals has passed
 * // 4 intervals has passed
 * // 5 intervals has passed
 * 
 */
export default function timer(callback, interval = 1000) {
    const startingTime = new Date();
    const timeoutID = setInterval(() => {
        const intervalsPassed = Math.floor(
            (new Date() - startingTime) / interval
        );
        callback(intervalsPassed);
    }, interval);

    return {
        stop: function stop() {
            clearTimeout(timeoutID);
        },
    }
}
