/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 * 
 */

// React
import React from "react";

// CSS
import './Grid.css';

export default class Grid extends React.Component {
    constructor(props) {
        super(props);
    }

    renderColumn(column, rowIndex, columnIndex) {
        const {
            renderCell
        } = this.props;

        const cellData = {
            rowIndex,
            columnIndex,
            ...column
        };

        return (
            <div
                className="Grid__column"
                key={columnIndex}
            >
                {renderCell(rowIndex, columnIndex, column)}
            </div>
        )
    }

    renderRow(columns, rowIndex) {
        return (
            <div
                className="Grid__row"
                key={rowIndex}
            >
                {columns.map((column, columnIndex) =>
                    this.renderColumn(column, rowIndex, columnIndex)
                )}
            </div>
        )
    }

    render() {
        const { gridData } = this.props;
        return (
            <div className="Grid">
                {gridData.map((row, rowIndex) =>
                        this.renderRow(row, rowIndex)
                )}
            </div>
        );
    }
}
