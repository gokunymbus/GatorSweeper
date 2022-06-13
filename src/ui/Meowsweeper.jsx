
import React from 'react';
import Grid from './Grid';

import {
    createGrid,
    updateTile
} from '../library/Grid';

export default class Meowsweeper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {grid: createGrid()};
    }

    onTileSelected = (e, props) => {
        const {row, column} = props;
        console.log("hello from the top", props.row, props.column);
        const newGrid = updateTile({
            rowIndex: row,
            columnIndex: column,
            originalGrid: this.state.grid
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