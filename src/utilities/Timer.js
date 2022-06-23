export default function timer(callback, interval = 1000) {
    const startingTime = new Date();
    const timeoutID = setInterval(() => {
        const intervalsPassed = Math.floor((new Date() - startingTime) / interval);
        callback(intervalsPassed);
    }, interval);

    return {
        stop: function stop() {
            clearTimeout(timeoutID);
        },
    }
}
