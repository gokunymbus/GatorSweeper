import React from 'react';
import Clamp from './Clamp';

/**
 * FocusGrid is a simple focus manager for grid like structures.
 * It must be used with the FocusGridCellDataAtrribute function
 * to allow cells to be focusable. It by no means is a full 
 * featured focus manager. 
 * 
 * @todo Other versions will likley come 
 * with more focus support. Ideally this component would only
 * require an attribute and make the assumptions about each
 * cell in the DOM in respect to two dimensional navigation.
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

const focusGridPositionKeyName = "data-focusgridposition";

export function FocusGridCellDataAttribute(rowIndex, columnIndex) {
    return { [focusGridPositionKeyName]: `${rowIndex}-${columnIndex}` };
}

function FocusGridCellKeySelector(rowIndex, columnIndex) {
    const keyValue = FocusGridCellDataAttribute(rowIndex, columnIndex);
    return `[${focusGridPositionKeyName}="${keyValue[focusGridPositionKeyName]}"]`;
}

export class FocusGrid extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            activeRow: 0,
            activeColumn: 0
        }
    }

    groupRef = React.createRef();

    onKeyUpHandler = (e) => {
        const {current} = this.groupRef;
        if (e.target == current) {
            return;
        }
    
        const {activeRow, activeColumn} = this.state;
        const {rowLength, columnLength} = this.props;
        
        let newFocus = {activeRow, activeColumn};
        switch(true) {
            case e.key == "ArrowUp":
                const up =  activeRow - 1;
                newFocus.activeRow = Clamp(up, 0, rowLength -1);
                break;
            case e.key == "ArrowDown":
                const down =  activeRow + 1;
                newFocus.activeRow = Clamp(down, 0, rowLength -1);
                break;
            case e.key == "ArrowLeft":
                const left =  activeColumn - 1;
                newFocus.activeColumn = Clamp(left, 0, columnLength - 1);
                break;
            case e.key == "ArrowRight":
                const right =  activeColumn + 1;
                newFocus.activeColumn = Clamp(right, 0, columnLength - 1);
                break;
            default:
                break;
        }

        this.setState({
            activeRow: newFocus.activeRow,
            activeColumn: newFocus.activeColumn
        });
    }

    setFocusCells() {
        const {current} = this.groupRef;

        const focusableElements = current.querySelectorAll(`[${focusGridPositionKeyName}]`);
        if (focusableElements.length == 0) {
            console.warn("FocusGrid: No focusable cell elements");
            return;
        }

        focusableElements.forEach((element, index) => {
            if (index == 0) {
                element.setAttribute('tabindex', 0);
                return;
            }
            element.setAttribute('tabindex', -1)
        });
    }

    componentDidMount() {
        this.setFocusCells();
    }

    setTabIndex(element, rowIndex, columnIndex, newFocus, setFocus = false) {
        const foundElement = element.querySelector(
            FocusGridCellKeySelector(rowIndex, columnIndex)
        );

        foundElement.setAttribute('tabindex', newFocus);
        if (setFocus) {
            foundElement.focus();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // IF the grid has changed size at all, reset
        // all focus attributes and state;
        const { rowLength, columnLength } = this.props;
        if (rowLength !== prevProps.rowLength || columnLength !== prevProps.columnLength) {
            this.setFocusCells();
            this.setState({activeRow: 0, activeColumn: 0});
            return;
        }

        // If the active row/column is the same, do nothing
        // and return;
        const { activeRow, activeColumn } = this.state;
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
                onFocus={this.onFocusHandler}
                ref={this.groupRef}
                onKeyUp={this.onKeyUpHandler}
            >
                {children}
            </div>
        )
    }
}
