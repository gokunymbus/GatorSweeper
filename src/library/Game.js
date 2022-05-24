
export const GameState = {
    new: 1,
    failed: 2,
    inprogress: 3
}

export function gameFactory(params) {
    const {
        state = GameState.new,
        timer = 
    } = params;


    return {
        state,

    }
}