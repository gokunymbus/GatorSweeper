import {
    reducePerimeter,
    proximityReducer,
    processTarget,
    updateGridFromTarget,
    createGridWithProximites
} from './Grid';

import {
    testData,
    testDataThreeRevealed,
    testDataTwo,
    testDataTwoRevealed,
    processTargetsResult
} from './Grid.testdata';

const perimeterLength = 3;
const offset = Math.floor(perimeterLength / 2);

describe('Grid', () => {
    test('createGridWithProximites - properly creates grid with proximities', () => {
        const size = 100;
        const grid = createGridWithProximites({
            gridSize: size,
            randomMin: 1,
            randomMax: 5
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

    test('reducePerimeter - correctly calculates 8 meows in proximity', () => {
        const testStartingColumn = 1;
        const testStartingRow = 2;
        const expectedTotal = reducePerimeter({
            previousTotal: 0,
            currentPerimeterLength: perimeterLength * perimeterLength,
            currentColumn: testStartingColumn + offset,
            currentRow: testStartingRow + offset,
            origArray: testData,
            perimeterSize: perimeterLength,
            reducerCallback: proximityReducer,
            targetRow: testStartingRow,
            targetColumn: testStartingColumn
        });

        expect(expectedTotal).toBe(8);
    });

    test('reducePerimeter - correctly calculates 2 moews in proximity', () => {
        const testStartingColumn = 0;
        const testStartingRow = 0;
        const expectedTotal = reducePerimeter({
            previousTotal: 0,
            currentPerimeterLength: perimeterLength * perimeterLength,
            currentColumn: testStartingColumn + offset,
            currentRow: testStartingRow + offset,
            origArray: testData,
            perimeterSize: perimeterLength,
            reducerCallback: proximityReducer
        });
        expect(expectedTotal).toBe(2);
    });

    test('processTarget - correctly finds all changes based on target', () => {
        const targetColumn = 0;
        const targetRow = 0;
        const changes = processTarget({
            grid: testDataTwo,
            targetColumn,
            targetRow
        });
        expect(changes.length).toBe(15);
        expect(changes).toEqual(processTargetsResult);
    });

    test('updateGridFromTarget - returns the correct grid with updates applied', () => {
        const newGrid = updateGridFromTarget({
            targetRowIndex: 0,
            targetColumnIndex: 0,
            grid: testDataTwo
        });

        expect(newGrid).toEqual(testDataTwoRevealed);
    });

    test('updateGridFromTarget - updates a single tile when a tile is a prixmity or a meow', () => {
        const newGrid = updateGridFromTarget({
            targetRowIndex: 0,
            targetColumnIndex: 3,
            grid: testDataTwo
        });

        expect(newGrid).toEqual(testDataThreeRevealed);
    });

    test('updateGridFromTarget - new grid can be mutated without mutating original', () => {
        const newGrid = updateGridFromTarget({
            targetRowIndex: 0,
            targetColumnIndex: 0,
            grid: testDataTwo
        });

        newGrid[0][0].isMeow = true;
        expect(testDataTwo[0][0].isMeow).toBe(false);
    });
});