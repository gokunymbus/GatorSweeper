import RandomMinMax from "./RandomMinMax";
export function TileFactory(params) {
    const {
        min,
        max,
        isMeow =  RandomMinMax(min, max) == 1 ? true : false,
        isRevealed = false,
        proximities = 0
    } = params;

    return {
        isMeow,
        isRevealed,
        proximities
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