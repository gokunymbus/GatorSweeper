export function generateGrid(rowLength, columnLength, getTileData = (row, column) => {}) {

    function buildColumns(currentColumnLength, colArray, currentRowIndex, currentColumnIndex = 0) {
        if (currentColumnLength == 0) {
            return colArray;
        }

        const columnArray = colArray.concat(
            getTileData(
                currentRowIndex,
                currentColumnIndex
            )
        );

        const newColumnLength = currentColumnLength - 1;
        const newRowIndex = currentRowIndex;
        const newColumnIndex = columnArray.length;
        return buildColumns(newColumnLength, columnArray, newRowIndex, newColumnIndex);
    }

    function buildRows(currentRowLength, currentArray, currentRowIndex = 0) {
        if (currentRowLength == 0) {
            return currentArray;
        }

        // @TODO Still could be some nested objects that are not being cloned.
        const newRowsArray = [...currentArray, buildColumns(columnLength, [], currentRowIndex)];
        const newRowLength = currentRowLength - 1; 
        return buildRows(newRowLength, newRowsArray, newRowsArray.length);
    }
    
   return buildRows(rowLength, []);
};

/**
 * A recursive function that decrements a total length 
 * and decrements a "row" and "column" values allowing
 * a callback function to traverse the parimeter of a target
 * in a multi-demensional array of equal length columns across
 * any number of rows.
 * 
 * @param {Number} params.previousTotal The running total over each recursion call
 * @param {Number} params.currentPerimeterLength The entire length of the perimeter.
 * @param {Number} params.currentColumn The current index of the column in each recursive call.
 * @param {Number} params.currentRow The current index of the row in each recursive call.
 * @param {Number} 
 * @returns {Number} The total number of tiles in the perimeter of the target
 */
export function reducePerimeter(params) {
    const {
        previousTotal,
        currentPerimeterLength,
        currentColumn,
        currentRow,
        startingRow = currentRow,
        startingColumn = currentColumn,
        targetRow,
        targetColumn,
        reducerCallback,
        origArray,
        perimeterSize
    } = params;

    if (currentPerimeterLength == 0) {
        return previousTotal;
    }

    const isTarget = currentColumn == targetColumn && targetRow == currentRow;
    const newTotal = !isTarget ? reducerCallback(
        currentRow,
        currentColumn,
        previousTotal,
        origArray
    ) : previousTotal;

    const newPerimLength = currentPerimeterLength -1;
    const isNewRow = newPerimLength % perimeterSize == 0;
    const newColumn = isNewRow ? startingColumn : currentColumn - 1;
    const newRow = isNewRow ? currentRow - 1 : currentRow;
   
    return reducePerimeter(
        {
            previousTotal: newTotal,
            currentPerimeterLength: newPerimLength,
            currentColumn: newColumn,
            currentRow: newRow,
            startingRow,
            startingColumn,
            origArray,
            perimeterSize,
            reducerCallback,
            targetRow,
            targetColumn
        }
    );
}

export const reduceMeowCallback = (currentRow, currentColumn, previousTotal, origArray) => {
    const foundValue = origArray[currentRow] && origArray[currentRow][currentColumn];
    return (foundValue && foundValue.isMeow) ? previousTotal + 1 : previousTotal;
}

export function addProximities(gridArray, perimeterSize) {
    return gridArray.map((row, rowIndex, origArray) => {
        return row.map((column, columnIndex) => {
            if (column.isMeow) {
                return {...column};
            }

            const offset = Math.floor(perimeterSize/2);
            const meowsInPerimeter = reducePerimeter(
                {
                    previousTotal: 0,
                    currentPerimeterLength: perimeterSize * perimeterSize,
                    currentColumn: columnIndex + offset,
                    currentRow: rowIndex + offset,
                    origArray,
                    perimeterSize,
                    reducerCallback: reduceMeowCallback,
                    targetColumn: columnIndex,
                    targetRow: rowIndex
                }
            );
            return {...column, "proximities": meowsInPerimeter};
        });
    });
}
export function createGrid() {
    const gridSize = 10;
    const minRandomValue = 1;
    const maxRandomValue = 10;
    const perimeterSize = 3; // The wxh of the square around a target should be odd.
    // const propability = (gridSize * gridSize) / maxRandomValue;

    function randomMinMax(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function tileData(row, column) {
        const isMeow = randomMinMax(minRandomValue, maxRandomValue) == 1 ? true : false;
        return {
            // proximities: 0, To be added later
            isMeow: isMeow,
            isRevealed: false,
            row,
            column
        }
    }

    const getTileData = (row, column) => {
        return tileData(row, column);
    };

    const grid = generateGrid(gridSize, gridSize, getTileData);
    const gridWithProximities = addProximities(grid, perimeterSize);
    return gridWithProximities;
}

// This is getting complicated and ill be honest i'm stuck
// Let's break this problem down into tiny pieces and tackle each piece. 
// 1. When a tile is selected it needs to be revealed
// 2.   Then we need to get that tiles perimeters
            // foreach perimeter we need to reveal it if
            // it's not a meow
                // Then we need to get each perimeter tile

export function collectChanges() {
    const targetPerimeters = reducePerimeter({
        previousTotal: [],
        currentPerimeterLength: perimeterSize * perimeterSize,
        currentColumn: columnIndex + offset,
        currentRow: rowIndex + offset,
        origArray: originalGrid,
        perimeterSize,
        reducerCallback: (currentRow, currentColumn, previousValue, origArray) => {
            return [...previousValue, {...origArray[currentRow][currentColumn]}];
        },
        targetColumn: columnIndex,
        targetRow: rowIndex
    });
    const newTarge
    collectChanges(targetPerimeters, newTarget);
}

export function updateTile(params) { 
    const {
        rowIndex,
        columnIndex,
        originalGrid
    } = params;

    const perimeterSize = 3;
    const offset = Math.floor(perimeterSize/2);
    const tile = originalGrid[rowIndex][columnIndex];

    // We just reveal this tile if it's a meow or has proximities
    // if (tile.isMeow || tile.proximities > 0) {
    //     return originalGrid.map((row, rIndex) => row.map((column, cIndex) => {
    //         if (cIndex != columnIndex || rIndex != rowIndex) {
    //             return {...column}
    //         }
    //         return {...column, isRevealed: true};
    //     }));
    // }

    // If it's a blank tile then we need to proces each perimeter
    // and check each status and repeat until no perimeters are blank.
    const targetPerimeters = reducePerimeter({
        previousTotal: [],
        currentPerimeterLength: perimeterSize * perimeterSize,
        currentColumn: columnIndex + offset,
        currentRow: rowIndex + offset,
        origArray: originalGrid,
        perimeterSize,
        reducerCallback: (currentRow, currentColumn, previousValue, origArray) => {
            return [...previousValue, {...origArray[currentRow][currentColumn]}];
        },
        targetColumn: columnIndex,
        targetRow: rowIndex
    });
    
    targetPerimeters.forEach(element => {
        
    });

    console.log(targetPerimeters);

}