
import React from 'react';
import Grid from './Grid';
import Controls from './Controls';
import Language from '../library/Language';

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
    timeoutIDs = [];

    constructor(props) {
        super(props);
        this.state = this.getIntialGameState();
    }

    getIntialGameState = () => {
        return {
            grid: createGridWithProximites({
                gridSize: this.defaultGridSize,
                randomMin: this.defaultMin,
                randomMax: this.defaultMax
            }),
            flags: Defaults.startingFlags,
            timer: 0,
            isGameRunning: false,
            isGameOver: false
        }
    }

    createTimer = () => {
        this.timerRef = timer(this.onTimerUpdate);
    }

    clearTimer = () => {
        if (this.timerRef) {
            this.timerRef.stop();
            this.timerRef = null;
        }
    }

    clearTimeouts = () => {
        if (this.timeoutIDs.length > 0) {
            this.timeoutIDs.forEach((tid) => {
                clearTimeout(tid);
            });
        }
    }

    resetGame = () => {
        this.clearTimeouts();
        this.clearTimer();

        this.setState(this.getIntialGameState());
    }

    selectTile = (tileProps) => {
        const {row, column, isMeow, isFlagged} = tileProps;
        const {grid, isGameOver} = this.state;

        if (isGameOver || isFlagged) {
            return;
        }

        if (isMeow) {
            // Here we update one mine at a time
            // by picking one out of the Grid and then
            // delaying when it's set state is called
            const mines = reduceMines(grid);
            mines.forEach((mine) => {
                const tid = setTimeout(() => {
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
                this.timeoutIDs = this.timeoutIDs.concat(tid);
            });
        }

        const isNowGameOver = isMeow ? true : false;
        if (isNowGameOver) {
           this.clearTimer();
        }

        const newGrid = updateGridFromTarget({
            targetRowIndex: row,
            targetColumnIndex: column,
            grid
        });

        this.setState({
            grid: newGrid,
            isGameRunning: true,
            isGameOver: isNowGameOver
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