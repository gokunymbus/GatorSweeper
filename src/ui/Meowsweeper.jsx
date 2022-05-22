
import React from 'react';
import Grid from './Grid';

import {
    createGridWithProximites,
    updateGridFromTarget
} from '../library/Grid';

export default class Meowsweeper extends React.Component {
    
    constructor(props) {
        super(props);
        const defaultGridSize = 10;
        const newGrid = createGridWithProximites({
            gridSize: defaultGridSize,
            randomMin: 1,
            randomMax: 10
        });
        this.state = {grid: newGrid};
    }

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

    render() {
        const { grid } = this.state;
        return (
            <Grid gridData={grid} onTileSelected={this.onTileSelected}/>
        );
    }

}