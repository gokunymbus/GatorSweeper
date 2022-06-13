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

    renderColumn(column) {
       return (
        <div className="Grid__column">
            <Tile {...column} onTileSelected={this.onTileSelected} />
        </div>
       )
    }

    renderRow(columns) {
        return (
            <div className="Grid__row">
                {columns.map((column) => this.renderColumn(column))}
            </div>
        )
    }

    render() {
        const { gridData } = this.props;
        return (
            <div class="Grid">
                {
                    gridData.map((row) => this.renderRow(row))
                }
            </div>
        );
    }
}