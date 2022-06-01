
import React from 'react';
import Grid from './Grid';
import Controls from './Controls';

import {
    createGridWithProximites,
    reduceMines,
    updateGridFromTarget,
    updateTargetTile
} from '../library/Grid';

import timer from '../library/Timer';

import './Game.css';
import Defaults from '../library/Defaults';
import Tile from './Tile';
import RandomMinMax from '../library/RandomMinMax';

export default class Game extends React.Component {
    defaultGridSize = 10;
    defaultMin = 1;
    defaultMax = 10;
    timerRef = null;

    constructor(props) {
        super(props);
        const newGrid = createGridWithProximites({
            gridSize: this.defaultGridSize,
            randomMin: this.defaultMin,
            randomMax: this.defaultMax
        });

        this.state = {
            grid: newGrid,
            flags: Defaults.startingFlags,
            timer: 0,
            isGameRunning: false,
            isGameOver: false
        };
    }

    createTimer = () => {
        this.timerRef = timer(this.onTimerUpdate);
    }

    resetGame = () => {
        if (this.timerRef) {
            this.timerRef.stop();
            this.timerRef = null;
        }

        const newGrid = createGridWithProximites({
            gridSize: this.defaultGridSize,
            randomMin: this.defaultMin,
            randomMax: this.defaultMax
        });

        this.setState({
            grid: newGrid,
            timer: 0,
            flags:  Defaults.startingFlags,
            isGameRunning: false, 
            isGameOver: false
        });
    }

    selectTile = (tileProps) => {
        const {row, column, isMeow, isFlagged} = tileProps;
        const {grid, isGameOver} = this.state;

        if (isGameOver || isFlagged) {
            return;
        }

        if (isMeow) {
            const mines = reduceMines(grid);
            mines.forEach((mine) => {
                setTimeout(() => {
                    this.setState((previousState) => {
                        const newGrid = updateTargetTile({
                            targetRow: mine.row,
                            targetColumn: mine.column,
                            grid: previousState.grid,
                            tileParams: {
                                isRevealed: true
                            }
                        });
    
                        return {grid: newGrid}
                    });
                }, RandomMinMax(300, 1200));
            });
        }

        const newGrid = updateGridFromTarget({
            targetRowIndex: row,
            targetColumnIndex: column,
            grid
        });

        this.setState({
            grid: newGrid,
            isGameRunning: true,
            isGameOver: isMeow ? true : false
        });
    }

    onTimerUpdate = (seconds) => {
        this.setState({
            timer: seconds
        });
    };

    onTileRightClicked = (e, tileProps) => {
        const {row, column} = tileProps;
        const {grid, flags} = this.state;
        const tile = grid[row][column];
        // If there are no flags left, don't place them
        if (flags == 0 || tile.isRevealed) {
            return;
        }

       const isFlagged = !tile.isFlagged;

        const newGrid = updateTargetTile({
            targetRow: row,
            targetColumn: column,
            grid,
            tileParams: {
                isFlagged
            }
        });

        this.setState({
            grid: newGrid,
            flags: isFlagged ?  flags - 1 : flags + 1
        });
    };

    onEnterKeyUp = (e, tileProps) => {
        this.selectTile(tileProps);
    };

    onTileSelected = (e, tileProps) => {
        this.selectTile(tileProps);
    };

    onMainIconSelected = () => {
       this.resetGame();
    };

    componentDidUpdate(previousProps, previousState) {
        const { isGameRunning } = this.state;
        if (isGameRunning && !previousState.isGameRunning) {
           this.createTimer();
        }
    }

    render() {
        const {
            grid,
            flags,
            timer,
            isGameOver
        } = this.state;
        return (
            <div className="Game">
                <Controls
                    onMainIconSelected={this.onMainIconSelected}
                    flags={flags}
                    timer={timer}
                    isGameOver={isGameOver}
                />
                <Grid
                    gridData={grid}
                    gridSize={this.defaultGridSize}
                >
                    <Tile
                       onTileSelected={this.onTileSelected}
                       onTileRightClicked={this.onTileRightClicked}
                       onEnterKeyUp={this.onEnterKeyUp}
                    />
                </Grid>
            </div>
        );
    }

}