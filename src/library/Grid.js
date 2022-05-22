import { TileFactory, TileChangeFactory } from "./Tile";

const perimeterSize = 3;
const offset = Math.floor(perimeterSize/2);

/**
 * The entry point function for creating the grid, creates the grid and 
 * adds proximities to the grid. 
 * 
 * @param {object} params params object
 * @param {number} params.gridSize The size of the grid (gridsize * 2)
 * @param {number} params.randomMin The minimum value in random number generation.
 * @param {number} params.randomMax The maximum value in number generation.
 * @returns new Grid with proximity information included.
 */
export function createGridWithProximites(params) {
    const {
        gridSize,
        randomMin,
        randomMax
    } = params;

    return addProximities(
        createGrid({
            gridSize,
            randomMin,
            randomMax
        })
    );
}

export function createGrid(params) {
    const {
        gridSize,
        randomMin,
        randomMax
    } = params;

    function buildColumns(params) {
        const {
            columnIndex,
            accumulator = [],
            rowIndex,
        } = params;

        if (columnIndex == -1) {
            return accumulator;
        }

        return buildColumns({
            columnIndex: columnIndex - 1,
            rowIndex,
            accumulator: accumulator.concat(
                TileFactory({
                    min: randomMin,
                    max: randomMax
                })
            )
        });
    }

    function buildRows(params) {
        const {
            rowIndex,
            accumulator
        } = params;

        if (rowIndex == -1) {
            return accumulator;
        }

        const columns = buildColumns({
            columnIndex: gridSize -1,
            accumulator: [],
            rowIndex: rowIndex
        });

        return buildRows({
            rowIndex: rowIndex -1,
            accumulator: [...accumulator, columns]
        });
    }

    const grid = buildRows({
        rowIndex: gridSize - 1,
        accumulator: []
    });

    return grid;
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
        origArray
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
            reducerCallback,
            targetRow,
            targetColumn
        }
    );
}

export const proximityReducer = function(currentRow, currentColumn, previousTotal, origArray)  {
    const foundValue = origArray[currentRow] && origArray[currentRow][currentColumn];
    return (foundValue && foundValue.isMeow) ? previousTotal + 1 : previousTotal;
}

export function addProximities(gridArray) {
    return gridArray.map((row, rowIndex, origArray) => {
        return row.map((column, columnIndex) => {
            if (column.isMeow) {
                return TileFactory({...column});
            }
            const meowsInPerimeter = reducePerimeter(
                {
                    previousTotal: 0,
                    currentPerimeterLength: perimeterSize * perimeterSize,
                    currentColumn: columnIndex + offset,
                    currentRow: rowIndex + offset,
                    origArray,
                    perimeterSize,
                    reducerCallback: proximityReducer,
                    targetColumn: columnIndex,
                    targetRow: rowIndex
                }
            );
            return TileFactory({...column, proximities: meowsInPerimeter});
        });
    });
}

/**
 * The first function in a series of mutual recursion calls that adds
 * the target value to an accumulator value and calls recursePerimeters
 * which in turn calls this function again until all base conditions
 * are met. 
 * 
 * @param {object} params The main params object
 * @param {Grid} params.grid The grid matrix.
 * @param {number} params.targetColumn The column index of the target to process.
 * @param {number} params.targetRow The row index of the target to process.
 * @param {array} params.accumulator The accumulating array
 */
export function processTarget(params) {
    const {
        grid,
        targetColumn,
        targetRow,
        accumulator = []
    } = params;

    // If the target is already in our list of changes
    // we have completed the base condition of this recursive call.
    const doesTargetExist = accumulator.find(tile => targetColumn == tile.column && targetRow == tile.row);
    if (doesTargetExist) {
        return accumulator;
    }

    const target = grid[targetRow][targetColumn];
    const {
        isMeow,
        proximities
    } = target;
    const newTarget = TileChangeFactory({tileParams: {...target}, row: targetRow, column: targetColumn});
    const isBlank = !isMeow && proximities == 0;
    // IF it's not blank then it has a mine or
    // it has mines in proximity so let's return it
    // and not try to recurse it's perimeters.
    if (!isBlank) {
        return [...accumulator, newTarget];
    }

    return recursePerimeters({
        perimeters: reducePerimeter({
            previousTotal: [],
            currentPerimeterLength: perimeterSize * perimeterSize,
            currentColumn: targetColumn + offset,
            currentRow: targetRow + offset,
            origArray: grid,
            perimeterSize,
            reducerCallback: (currentRow, currentColumn, previousValue, originalGrid) => {
                const tile = originalGrid[currentRow] && originalGrid[currentRow][currentColumn];
                return (tile) ? 
                    [...previousValue, TileChangeFactory({tileParams: {...tile}, row: currentRow, column: currentColumn})] 
                        :
                    [...previousValue];
            },
            targetColumn,
            targetRow,
        }),
        grid,
        targetAccumulator: [...accumulator, newTarget]
    });
}

/**
 * A function used in Mutual Recursion with processTarget that recurses perimeters
 * and calls processTarget on each one.
 * 
 * @param {object}  params Perimeters
 * @param {Array}   params.perimeters The perimeters reduced from previous call.
 * @param {number}  params.currentIndex The index this call is currently on.
 * @param {Array}   params.targetAccumulator The property that all targets accumulate too.
 * @param {array}   params.grid The original Grid array. 
 * @returns 
 */
function recursePerimeters(params) {
    const {
        perimeters,
        currentIndex = perimeters.length -1,
        targetAccumulator,
        grid
    } = params;

    // Base condition
    if (currentIndex == -1) {
        return targetAccumulator;
    }
    
    const perimeter = perimeters[currentIndex];
    return processTarget({
        grid,
        targetColumn: perimeter.column,
        targetRow: perimeter.row,
        accumulator: recursePerimeters({
            perimeters,
            currentIndex: currentIndex -1,
            targetAccumulator,
            grid
        })
    });
}

/**
 * Maps an array of objects to update to the original Grid
 * 
 * @param {Array} grid The matrix of tiles
 * @param {Array} changes An array of tile objects to be applied back to the grid. 
 * @returns New array with changes mapped.
 */
function mapChanges(grid, changes) {
    return grid.map((row, rowIndex) => {
        return row.map((column, columnIndex) => {
            const findChange = changes.find(
                tile => tile.row == rowIndex && tile.column == columnIndex
            );
            if (findChange) {
                return TileFactory({...column, isRevealed: true})
            }

            return TileFactory(column);
        })
    });
}

/**
 * A function that starts the process of collecting changes
 * and mapping them back to a new version of the Grid.
 * @param {object} param Object containing all params.
 * @param {number} params.targetRowIndex The index of the target row
 * @param {number} params.targetColumnIndex The index of the target column.
 * @param {Array<Array>} params.grid The current grid or "Matrix" to perform updates on.
 * @returns {array} A new and updated version of grid "matrix"
 */
export function updateGridFromTarget(params) { 
    const {
        targetRowIndex,
        targetColumnIndex,
        grid
    } = params;

    return mapChanges(
        grid,
        processTarget({
            grid,
            targetRow: targetRowIndex,
            targetColumn: targetColumnIndex
        })
    );
}