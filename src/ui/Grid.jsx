import React from "react";
import './Grid.css';
import Language from "../utilities/Language";
import {FocusGrid} from "../utilities/FocusGrid";

import Tile from './Tile';

export default class Grid extends React.Component {
    constructor(props) {
        super(props);
    }

    language = Language();
    gridRef = React.createRef();

    renderColumn(column, rowIndex, columnIndex) {
        const {
            gridSize,
            children
        } = this.props;
        const cellData = {row: rowIndex, column: columnIndex};
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
                    {...cellData}
                    {...children.props}
                />
            </div>
        )
    }

    componentDidMount() {
        console.log(this.gridRef.current);
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
                tabIndex={0}
            >
                {columns.map((column, columnIndex) => this.renderColumn(column, rowIndex, columnIndex))}
            </div>
        )
    }

    render() {
        const { gridData } = this.props;
        return (
            <FocusGrid
                rowLength={gridData.length}
                columnLength={gridData[0].length}
                aria-label={this.language.gridAED}
                className={"Grid__focusGroup"}
            >
                <section className="Grid">
                    {
                        gridData.map((row, rowIndex) => this.renderRow(row, rowIndex))
                    }
                </section>
            </FocusGrid>
        );
    }
}