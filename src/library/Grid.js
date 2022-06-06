import { TileFactory, TileChangeFactory } from "./Tile";
import InRange from "../utilities/InRange";

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

/**
 * Creates and returns a new multi-dimensional array with basic tile data from 
 * a TileFactory call. 
 * 
 * @param {object} params params object
 * @param {number} params.gridSize The size of the grid (gridsize * 2)
 * @param {number} params.randomMin The minimum value in random number generation.
 * @param {number} params.randomMax The maximum value in number generation.
 * @returns 
 */
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

export function rangeFactory(params) {
    const {
        perimeterSize = 3,
        offset = Math.floor(perimeterSize/2),
        targetRowIndex,
        targetColumnIndex
    } = params;

    return {
        begin: {
            row: targetRowIndex - offset,
            column: targetColumnIndex - offset
        },
        end: {
            row: targetRowIndex + offset,
            column: targetColumnIndex + offset
        },
        target: {
            row: targetRowIndex,
            column: targetColumnIndex
        }
    }
};

export function getPerimeters(params) {
    const {
        range,
        grid
    } = params;

    return grid.reduce((previousRow, currentRow, currentRowIndex) => {
        return previousRow.concat(
            currentRow.reduce((previousColumn, currentColumn, currentColumnIndex) => {
                const { begin, end, target } = range;
                const rowInRange = InRange(begin.row, end.row, currentRowIndex);
                const columnInRange = InRange(begin.column, end.column, currentColumnIndex);
                const isTarget = currentRowIndex == target.row && currentColumnIndex == target.column;

                // indexs not in range
                if (!rowInRange || !columnInRange || isTarget) {
                    return previousColumn;
                }

                return previousColumn.concat(TileChangeFactory({
                    tileParams: {...currentColumn},
                    row: currentRowIndex,
                    column: currentColumnIndex
                }));
            }, [])
        )
    }, []);
}

/**
 * Add's proximity values to a given Grid and returns a new Grid.
 * 
 * @param {Grid} gridArray The Grid[row][colun] array/object.
 * @returns 
 */
export function addProximities(gridArray) {
    return gridArray.map((row, rowIndex) => {
        return row.map((column, columnIndex) => {
            if (column.isMeow) {
                return TileFactory({...column});
            }

            const range = rangeFactory({
                targetRowIndex: rowIndex,
                targetColumnIndex: columnIndex
            });

            const proximities = getPerimeters({
                range,
                grid: gridArray
            });

            const totalMinesInRange = proximities.reduce((previousValue, currentValue) => {
                return currentValue.isMeow ? previousValue + 1 : previousValue;
            }, 0);

            return TileFactory({...column, proximities: totalMinesInRange});
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
        proximities,
        isFlagged
    } = target;
    const newTarget = TileChangeFactory({tileParams: {...target}, row: targetRow, column: targetColumn});
    const isBlank = !isMeow && proximities == 0 && !isFlagged;
    // IF it's not blank then it has a mine or
    // it has mines in proximity so let's return it
    // and not try to recurse it's perimeters.
    if (!isBlank) {
        return [...accumulator, newTarget];
    }

    const range = rangeFactory({
        targetRowIndex: targetRow,
        targetColumnIndex: targetColumn
    });

    const targetProximities = getPerimeters({
        range,
        grid
    });

    return recursePerimeters({
        perimeters: targetProximities,
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
                return TileFactory({...column, isRevealed: findChange.isFlagged ? false: true})
            }

            return TileFactory(column);
        })
    });
}

/**
 * A function that starts the process of collecting changes
 * and mapping them back to a new version of the Grid.
 * 
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

/**
 * Updates the target tile with any tileParams
 * and returns a new grid. 
 * 
 * @param {*} params 
 * @param {number} params.targetRow The target row index
 * @param {number} params.targetColumn The target column index
 * @param {Grid} params.grid The grid object
 * @param {TileFactory} params.tileParams Paremeters for the TileFactory.
 * @returns New Grid with updated tile
 */
export function updateTargetTile(params) {
    const {
        targetRow,
        targetColumn,
        grid,
        tileParams
    } = params;

    return grid.map((row, rowIndex) => row.map((column, columnIndex) => {
        if (targetRow == rowIndex && targetColumn == columnIndex) {
            return TileFactory({...column, ...tileParams});
        }
        return  TileFactory({...column});
    }));
}

export function reduceMines(grid) {
    return grid.reduce((previousRow, currentRow, currentRowIndex) => {
        return previousRow.concat(
            currentRow.reduce((previousColumn, currentColumn, currentColumnIndex) => {
                if (!currentColumn.isMeow) {
                    return previousColumn;
                }

                return previousColumn.concat(TileChangeFactory({
                    tileParams: {...currentColumn},
                    row: currentRowIndex,
                    column: currentColumnIndex
                }));
                
            }, [])
        )
    }, [])
}

export function numberOfRevealedTiles(grid) {
    return grid.reduce((previousRow, currentRow) => {
        return previousRow + currentRow.reduce((previousValue, currentColumn) => {
            if (currentColumn.isMeow || !currentColumn.isRevealed) {
                return previousValue;
            }
            return previousValue + 1;
        }, 0)
    }, 0)
}

export function numberOfMines(grid) {
    return grid.reduce((previousRow, currentRow) => {
        return previousRow + currentRow.reduce((previousValue, currentColumn) => {
            if (!currentColumn.isMeow) {
                return previousValue;
            }
            return previousValue + 1;
        }, 0)
    }, 0)
}