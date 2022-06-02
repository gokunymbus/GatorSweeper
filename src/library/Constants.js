
export const Difficulties = Object.freeze({
    EASY:   Symbol("easy"),
    HARD:  Symbol("hard"),
    EXTREME: Symbol("extreme")
});

export const DifficultySettings = {
    [Difficulties.EASY]: {
        flags: 20,
        minMines: 1,
        maxMines: 10,
        size: 10
    },
    [Difficulties.HARD]: {
        flags: 40,
        minMines: 1,
        maxMines: 7,
        size: 20
    },
    [Difficulties.EXTREME]: {
        flags: 100,
        minMines: 1,
        maxMines: 4,
        size: 30
    }
}

export const GameState = Object.freeze({
    NEW:   Symbol("new"),
    RUNNING:   Symbol("running"),
    ENDED:  Symbol("ended")
});