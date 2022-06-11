import RandomMinMax from "../utilities/RandomMinMax";
export function TileFactory(params) {
    const {
        min,
        max,
        isMine =  RandomMinMax(min, max) == 1 ? true : false,
        isRevealed = false,
        proximities = 0,
        isFlagged = false
    } = params;

    return {
        isMine,
        isRevealed,
        proximities,
        isFlagged
    }
}

export function TileChangeFactory(params) {
    const {
        row,
        column,
        tileParams
    } = params;

    return {
        ...TileFactory(tileParams),
        row,
        column
    }
};