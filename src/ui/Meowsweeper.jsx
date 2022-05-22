
import React from 'react';
import Grid from './Grid';

import {
    createGrid,
    updateGridFromTarget
} from '../library/Grid';

export default class Meowsweeper extends React.Component {
    
    constructor(props) {
        super(props);
        const defaultGridSize = 10;
        this.state = {grid: createGrid({
            gridSize: defaultGridSize,
            randomMin: 1,
            randomMax: 10
        })};
    }

    onTileSelected = (e, props) => {
        const {row, column} = props;
        const {grid} = this.state;
        console.log("hello from the top", props.row, props.column);

        if (grid[row][column].isMeow) {
            console.log("GAME OVER");
            return;
        }

        const newGrid = updateGridFromTarget({
            targetRowIndex: row,
            targetColumnIndex: column,
            grid: this.state.grid
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