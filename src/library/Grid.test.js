import {
    processTarget,
    updateGridFromTarget,
    createGridWithProximites,
    getPerimeters,
    rangeFactory,
} from "./Grid";

import {
    testData,
    testDataThreeRevealed,
    testDataTwo,
    testDataTwoRevealed,
    processTargetsResult,
} from "./Grid.testdata";

const perimeterLength = 3;
const offset = Math.floor(perimeterLength / 2);

describe("Grid", () => {
    test("createGridWithProximites - properly creates grid with proximities", () => {
        const size = 100;
        const grid = createGridWithProximites({
            gridSize: size,
            randomMin: 1,
            randomMax: 5,
        });

        expect(grid).toBeDefined();
        expect(grid[size -1][size -1]).toBeDefined();
        expect(grid.length).toBe(size);
        expect(grid[0].length).toBe(size);

        const proximitiesCount = grid.reduce((previousValue, currentValue) => {
            return currentValue.reduce((secondPreviousValue, secondCurrentValue) => {
                if (secondCurrentValue.proximities > 0) {
                    return secondPreviousValue + 1;
                }
                return secondPreviousValue;
            }, 0);
        }, 0)

        expect(proximitiesCount).toBeGreaterThan(0);
    });

    test("processTarget - correctly finds all changes based on target", () => {
        const targetColumn = 0;
        const targetRow = 0;
        const changes = processTarget({
            grid: testDataTwo,
            targetColumn,
            targetRow,
        });
        expect(changes.length).toBe(15);
        expect(changes).toEqual(processTargetsResult);
    });

    test("updateGridFromTarget - returns the correct grid with updates applied", () => {
        const newGrid = updateGridFromTarget({
            targetRowIndex: 0,
            targetColumnIndex: 0,
            grid: testDataTwo,
        });

        expect(newGrid).toEqual(testDataTwoRevealed);
    });

    test("updateGridFromTarget - updates a single tile when a tile is a prixmity or a meow", () => {
        const newGrid = updateGridFromTarget({
            targetRowIndex: 0,
            targetColumnIndex: 3,
            grid: testDataTwo,
        });

        expect(newGrid).toEqual(testDataThreeRevealed);
    });

    test("updateGridFromTarget - new grid can be mutated without mutating original", () => {
        const newGrid = updateGridFromTarget({
            targetRowIndex: 0,
            targetColumnIndex: 0,
            grid: testDataTwo,
        });

        newGrid[0][0].isMine = true;
        expect(testDataTwo[0][0].isMine).toBe(false);
    });

    test("rangeFactory - returns correct ranges", () => {
        const range = rangeFactory({
            targetRowIndex: 2,
            targetColumnIndex: 1,
        });

        expect(range.begin.row).toBe(1);
        expect(range.begin.column).toBe(0);

        expect(range.end.row).toBe(3);
        expect(range.end.column).toBe(2);

        expect(range.target.row).toBe(2);
        expect(range.target.column).toBe(1);
    });

    test("getPerimeters - expect to return all 8 perimeters", () => {
        const range = rangeFactory({
            targetRowIndex: 2,
            targetColumnIndex: 1,
        });
        const perimeters = getPerimeters({
            range,
            grid: testData,
        });
        expect(perimeters.length).toBe(8)
    });

    test("getPerimeters - expect to return all 3 perimeters", () => {
        const range = rangeFactory({
            targetRowIndex: 0,
            targetColumnIndex: 0,
        });
        const perimeters = getPerimeters({
            range,
            grid: testData,
        });
        expect(perimeters.length).toBe(3)
    });

    test("getPerimeters - expect the correct perimeters to be returned and target to be undefined", () => {
        const range = rangeFactory({
            targetRowIndex: 2,
            targetColumnIndex: 1,
        });

        const {
            begin,
            end,
            target,
        } = range;

        const perimeters = getPerimeters({
            range,
            grid: testData,
        });

        const firstPerimeter = perimeters.find((tile) => tile.row == begin.row && tile.column == begin.column);
        const endPerimeter = perimeters.find((tile) => tile.row == end.row && tile.column == end.column);
        const targetTile = perimeters.find((tile) => tile.row == target.row && tile.column == target.column);
        expect(targetTile).toBeUndefined();
        expect(firstPerimeter).toBeDefined();
        expect(endPerimeter).toBeDefined();
    });
});
