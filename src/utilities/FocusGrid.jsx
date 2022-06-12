import React from 'react';
import Clamp from './Clamp';

/**
 * FocusGrid is a component that works with <FocusGridCell> to enable
 * focus navigation for a grid structure with arrow keys or other keys. As the user
 * presses up/down/left/right a positive tabIndex will provided to immediate
 * child of <FocusGridCell>
 * 
 * @example
 * <FocusGrid>
 *    <div class="row">
 *      <div class="cell">
 *          <FocusGridCell row={0} column={0}>
 *              <Cell />
 *          </FocusGridCell>
 *      </div>
 *      <div class="cell">
 *           <FocusGridCell row={0} column={1}>
 *              <Cell />
 *           </FocusGridCell>
 *      </div>
 *   <div class="row">
 *      <div class="cell">
 *          <FocusGridCell row={1} column={0}>
 *              <Cell />
 *          </FocusGridCell>
 *      </div>
 *      <div class="cell">
 *           <FocusGridCell row={1} column={1}>
 *              <Cell />
 *           </FocusGridCell>
 *      </div>
 * </FocusGrid>
 *
 */
export const FocusGridCellDataName = "data-focusgridcell";

export class FocusGrid extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            activeIndex
        }
    }

    groupRef = React.createRef();

    componentDidMount() {
        const {current} = this.groupRef;
        current.addEventListener('keyup', (e) => {
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
            })
        });
    }

    moveDown() {
        
    }

    getSelector(row, column) {
        return `[${FocusGridCellColumnName}="${column}"]`
            + `[${FocusGridCellRowName}="${row}"]`;
    }

    componentDidUpdate(prevProps, prevState) {
        const { activeRow, activeColumn } = this.state;
        if (prevState.activeRow == activeRow && prevState.activeColumn == activeColumn) {
            return;
        }

        const {current} = this.groupRef;

        const oldFocusedElement = current.querySelector(
            this.getSelector(prevState.activeRow, prevState.activeColumn)
        );
        oldFocusedElement.setAttribute('tabindex', -1);

        const newFocusElement = current.querySelector(
            this.getSelector(activeRow, activeColumn)
        );
        newFocusElement.setAttribute('tabindex', 0);
        newFocusElement.focus();
    }


    render() {
        const {
            children,
            rowLength,
            columnLength,
            ...additionalProps
        } = this.props;
        return (
            <div
                className="FocusGrid"
                tabIndex={0}
                {...additionalProps}
                onFocus={this.onFocusHandler}
                ref={this.groupRef}
                role={"application"}
            >
                {children}
            </div>
        )
    }
}
