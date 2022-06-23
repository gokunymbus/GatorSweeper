import React from "react";
import Clamp from "./Clamp";

/**
 * FocusGrid is a simple focus manager for grid like structures.
 * It must be used with the FocusGridCellDataAtrribute function
 * to allow cells to be focusable. It by no means is a full
 * featured focus manager.
 *
 * @todo Other versions will likley come
 * with more focus support. Ideally this component would
 * calculate each cells direction position without relying
 * on a rigid rows and columns value.
 *
 * @example
 * <FocusGrid
 *      rowLength={10}
 *      columnLength={10}
 * >
 *    <div class="row">
 *      <div
 *          class="cell"
 *          {...FocusGridCellDataAtrribute(rowIndex, columnIndex)}
 *      >
 *           Content
 *      </div>
 *      <div
 *          class="cell"
 *          {...FocusGridCellDataAtrribute(rowIndex, columnIndex)}
 *      >
 *           Content
 *      </div>
 *      <div class="row">
 *      <div
 *          class="cell"
 *          {...FocusGridCellDataAtrribute(rowIndex, columnIndex)}
 *      >
 *           Content
 *      </div>
 *      <div
 *          class="cell"
 *          {...FocusGridCellDataAtrribute(rowIndex, columnIndex)}
 *      >
 *           Content
 *      </div>
 * </FocusGrid>
 *
 */
export class FocusGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeRow: 0,
            activeColumn: 0,
        }
    }

    groupRef = React.createRef();
    #initialState = true;

    onKeyUpHandler = (e) => {
        const {current} = this.groupRef;
        if (e.target == current) {
            return;
        }

        const {activeRow, activeColumn} = this.state;
        const {rowLength, columnLength} = this.props;

        const newFocus = {activeRow, activeColumn};
        switch (true) {
        case e.key == "ArrowUp":
            const up = activeRow - 1;
            newFocus.activeRow = Clamp(up, 0, rowLength -1);
            break;
        case e.key == "ArrowDown":
            const down = activeRow + 1;
            newFocus.activeRow = Clamp(down, 0, rowLength -1);
            break;
        case e.key == "ArrowLeft":
            const left = activeColumn - 1;
            newFocus.activeColumn = Clamp(left, 0, columnLength - 1);
            break;
        case e.key == "ArrowRight":
            const right = activeColumn + 1;
            newFocus.activeColumn = Clamp(right, 0, columnLength - 1);
            break;
        default:
            break;
        }

        this.setState({
            activeRow: newFocus.activeRow,
            activeColumn: newFocus.activeColumn,
        });
    }

    restTabIndexes() {
        const {current} = this.groupRef;

        const focusableElements = current.querySelectorAll(`[${focusGridPositionKeyName}]`);
        if (focusableElements.length == 0) {
            console.warn("FocusGrid: No focusable cell elements");
            return;
        }

        focusableElements.forEach((element, index) => {
            if (index == 0) {
                element.setAttribute("tabindex", 0);
                return;
            }
            element.setAttribute("tabindex", -1)
        });
    }

    componentDidMount() {
        this.restTabIndexes();
    }

    setTabIndex(element, rowIndex, columnIndex, newFocus, setFocus = false) {
        const foundElement = element.querySelector(
            FocusGridCellKeySelector(rowIndex, columnIndex),
        );

        foundElement.setAttribute("tabindex", newFocus);
        if (setFocus) {
            foundElement.focus();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // If the grid has changed size at all, reset
        // all focus attributes and state;
        const {rowLength, columnLength} = this.props;
        if (rowLength !== prevProps.rowLength || columnLength !== prevProps.columnLength) {
            this.restTabIndexes();
            this.setState({activeRow: 0, activeColumn: 0});
            this.#initialState = true;
            return;
        }

        // Prevents focus from being added
        // when the focus grid is reset/changed.
        if (this.#initialState) {
            this.#initialState = false;
            return;
        }

        // If the active row/column is the same, do nothing
        // and return;
        const {activeRow, activeColumn} = this.state;
        if (prevState.activeRow == activeRow && prevState.activeColumn == activeColumn) {
            return;
        }

        const {current} = this.groupRef;
        this.setTabIndex(current, activeRow, activeColumn, 0, true);
        this.setTabIndex(current, prevState.activeRow, prevState.activeColumn, -1);
    }


    render() {
        const {
            children,
            rowLength,
            columnLength,
            className,
            ...additionalProps
        } = this.props;
        return (
            <div
                className={`FocusGrid ${className || ""}`}
                {...additionalProps}
                ref={this.groupRef}
                onKeyUp={this.onKeyUpHandler}
            >
                {children}
            </div>
        )
    }
}


const focusGridPositionKeyName = "data-focusgridposition";

/**
 * Provides and key value object that can be
 * added to an HTML element to designate it as
 * focusable element in FocusGrid.
 *
 * @example
 * <div
 *  className="GridCell"
 *  {...FocusGridCellDataAttribute(0, 0)}
 *  >
 *  <p> Cell content </p>
 * </div>
 *
 * @param {*} rowIndex
 * @param {*} columnIndex
 * @return {object} {[keyname]: value}
 */
export function FocusGridCellDataAttribute(rowIndex, columnIndex) {
    return {[focusGridPositionKeyName]: `${rowIndex}-${columnIndex}`};
}

/**
 * Provides a CSS selector string based on
 * a row and column index.
 *
 * @param {*} rowIndex
 * @param {*} columnIndex
 * @return {CSSSe}
 */
function FocusGridCellKeySelector(rowIndex, columnIndex) {
    const keyValue = FocusGridCellDataAttribute(rowIndex, columnIndex);
    return `[${focusGridPositionKeyName}="${keyValue[focusGridPositionKeyName]}"]`;
}
