import React from "react";
import './Grid.css';
import Language from "../utilities/Language";
import {FocusGrid, FocusGridCell} from "../utilities/FocusGrid";
import { setFlagKey } from "../library/Constants";

import Tile from './Tile';
import ReplaceStringTokens from "../utilities/ReplaceStringTokens";

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

        const cellData = {
            row: rowIndex,
            column: columnIndex,
            forwardRef: React.createRef()
        };

        return (
            <div
                className="Grid__column"
                key={columnIndex}
            >
                <FocusGridCell
                    {...cellData}
                >
                    <Tile
                        {...column}
                        {...cellData}
                        {...children.props}
                    />
                </FocusGridCell>
            </div>
        )
    }

    renderRow(columns, rowIndex) {
        const {gridSize} = this.props;
        return (
            <div
                className="Grid__row"
                key={rowIndex}
            >
                {columns.map((column, columnIndex) => this.renderColumn(column, rowIndex, columnIndex))}
            </div>
        )
    }

    render() {
        const { gridData } = this.props;
        const formatedGridAED = ReplaceStringTokens(this.language.gridAED, [setFlagKey]);
        return (
            <FocusGrid
                rowLength={gridData.length}
                columnLength={gridData[0].length}
                aria-label={formatedGridAED}
                className={"Grid"}
            >
                {
                    gridData.map((row, rowIndex) => this.renderRow(row, rowIndex))
                }
            </FocusGrid>
        );
    }
}