import React from "react";
import './Grid.css';

import Tile from './Tile';

export default class Grid extends React.Component {
    constructor(props) {
        super(props);
    }
    
    onTileSelected = (e, tileProps) => {
        const {onTileSelected} = this.props;
        onTileSelected(e, tileProps);
    }

    renderColumn(column, rowIndex, columnIndex) {
       return (
        <div className="Grid__column">
            <Tile {...column} onTileSelected={this.onTileSelected} row={rowIndex} column={columnIndex} />
        </div>
       )
    }

    renderRow(columns, rowIndex) {
        return (
            <div className="Grid__row">
                {columns.map((column, columnIndex) => this.renderColumn(column, rowIndex, columnIndex))}
            </div>
        )
    }

    render() {
        const { gridData } = this.props;
        return (
            <div class="Grid">
                {
                    gridData.map((row, rowIndex) => this.renderRow(row, rowIndex))
                }
            </div>
        );
    }
}