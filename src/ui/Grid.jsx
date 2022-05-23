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
        <div className="Grid__column" key={columnIndex}>
            <Tile {...column} onTileSelected={this.onTileSelected} row={rowIndex} column={columnIndex} />
        </div>
       )
    }

    renderRow(columns, rowIndex) {
        return (
            <div className="Grid__row" key={rowIndex}>
                {columns.map((column, columnIndex) => this.renderColumn(column, rowIndex, columnIndex))}
            </div>
        )
    }

    render() {
        const { gridData } = this.props;
        return (
            <div className="Grid">
                {
                    gridData.map((row, rowIndex) => this.renderRow(row, rowIndex))
                }
            </div>
        );
    }
}