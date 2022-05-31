export default function timer(callback, interval = 1000) {
    const secondInMilleseconds = 1000;
    const startingTime = new Date();
    const timeoutID = setInterval(() => {
        const secondsPassed = Math.floor((new Date() - startingTime) / secondInMilleseconds);
        callback(secondsPassed)
    }, interval);
    
    return {
        stop: function stop() {
            clearTimeout(timeoutID);
        }
    }
}