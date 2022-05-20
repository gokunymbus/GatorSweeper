import {reducePerimeter, reduceMeowCallback} from './Grid';
import {testData} from './Grid.testdata';

const perimeterLength = 3;
const offset = Math.floor(perimeterLength / 2);

describe('Grid', () => {
    test('correctly calculates 8 meows in proximity', () => {
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

    test('correclty calculates 2 moews in proximity', () => {
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


    test('correclty calculates 2 moews in proximity', () => {
        
    });
});