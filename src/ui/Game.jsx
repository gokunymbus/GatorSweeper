
import React from 'react';
import Grid from './Grid';
import Controls from './Controls';

import {
    createGridWithProximites,
    updateGridFromTarget,
    updateTargetTile
} from '../library/Grid';

import timer from '../library/Timer';

import './Game.css';
import Defaults from '../library/Defaults';

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
            isGameRunning: false
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
            isGameRunning: false
        });
    }

    onTimerUpdate = (seconds) => {
        this.setState({
            ...this.state,
            timer: seconds
        });
    };

    onTileRightClicked = (e, props) => {
        const {row, column} = props;
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

    onTileSelected = (e, props) => {
        const {row, column} = props;
        const {grid} = this.state;

        if (grid[row][column].isMeow) {
            console.log("GAME OVER");
            return;
        }

        const newGrid = updateGridFromTarget({
            targetRowIndex: row,
            targetColumnIndex: column,
            grid
        });

        this.setState({
            grid: newGrid,
            isGameRunning: true
        });
    };

    onActionSelected = () => {
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
            timer
        } = this.state;
        return (
            <div className="Game">
                <Controls
                    onActionSelected={this.onActionSelected}
                    flags={flags}
                    timer={timer}
                />
                <Grid
                    gridData={grid}
                    onTileSelected={this.onTileSelected}
                    onTileRightClicked={this.onTileRightClicked}
                    gridSize={this.defaultGridSize}
                />
            </div>
        );
    }

}