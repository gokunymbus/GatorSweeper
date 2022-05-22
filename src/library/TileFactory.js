import RandomMinMax from "./RandomMinMax";
export default function TileFactory(params) {
    const {
        row,
        column,
        min,
        max,
        isMeow =  RandomMinMax(min, max) == 1 ? true : false,
        isRevealed = false,
        proximities = 0
    } = params;

    return {
        isMeow,
        isRevealed,
        proximities,
        row,
        column
    }
}