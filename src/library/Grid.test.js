import {
    reducePerimeter,
    reduceMeowCallback,
    processTarget,
    updateGridFromTarget
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
            reducerCallback: reduceMeowCallback,
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
            reducerCallback: reduceMeowCallback
        });
        expect(expectedTotal).toBe(2);
    });

    test('processTarget - correctly finds all changes based on target', () => {
        const targetColumn = 0;
        const targetRow = 0;
        const changes = processTarget({
            origArray: testDataTwo,
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