import React from "react";
import './Grid.css';

import Tile from './Tile';

export default class Grid extends React.Component {
    constructor(props) {
        super(props);
    }

    renderColumn(column, rowIndex, columnIndex) {
        const {
            gridSize,
            children
        } = this.props;
        return (
            <div
                className="Grid__column"
                key={columnIndex}
                style={{
                    width: (100/gridSize) + "%"
                }}
            >
                <Tile
                    {...column}
                    row={rowIndex}
                    column={columnIndex}
                    {...children.props}
                />
            </div>
        )
    }

    renderRow(columns, rowIndex) {
        const {gridSize} = this.props;
        return (
            <div
                className="Grid__row"
                key={rowIndex}
                style={{
                    height: (100/gridSize) + "%"
                }}
            >
                {columns.map((column, columnIndex) => this.renderColumn(column, rowIndex, columnIndex))}
            </div>
        )
    }

    render() {
        const { gridData } = this.props;
        return (
            <section className="Grid">
                {
                    gridData.map((row, rowIndex) => this.renderRow(row, rowIndex))
                }
            </section>
        );
    }
}