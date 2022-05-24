
import React from 'react';
import Grid from './Grid';
import Controls from './Controls';

import {
    createGridWithProximites,
    updateGridFromTarget,
    updateFlagForTarget

} from '../library/Grid';

import './Game.css';
import Defaults from '../library/Defaults';

export default class Game extends React.Component {
    
    constructor(props) {
        super(props);
        const defaultGridSize = 10;
        const newGrid = createGridWithProximites({
            gridSize: defaultGridSize,
            randomMin: 1,
            randomMax: 10
        });

        this.state = {
            grid: newGrid,
            flags: Defaults.startingFlags
        };
    }

    onTileRightClicked = (e, props) => {
        const {row, column} = props;
        const {grid, flags} = this.state;
        // If there are no flags left, don't place them
        if (flags == 0) {
            return;
        }

        const newGrid = updateFlagForTarget({
            targetRow: row,
            targetColumn: column,
            grid
        });
        this.setState({
            grid: newGrid,
            flags: flags - 1
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

        this.setState({grid: newGrid});
    };

    onActionSelected = () => {

    };

    render() {
        const { grid, flags } = this.state;
        return (
            <div className="Game">
                <Controls onActionSelected={this.onActionSelected} flags={flags}/>
                <Grid gridData={grid} onTileSelected={this.onTileSelected} onTileRightClicked={this.onTileRightClicked}/>
            </div>
        );
    }

}