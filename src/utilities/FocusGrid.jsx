import React from 'react';
import Clamp from './Clamp';
import MergeRefs from './MergeRefs';

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
 */
export class FocusGrid extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            activeRow: 0,
            activeColumn: 0
        }
    }

    groupRef = React.createRef();

    traverseChildren(elementChildren) {
        return React.Children.map(elementChildren, (child) => {
            const { activeColumn, activeRow } = this.state;
            const { children, row, column } = child.props;

            if (child.type != FocusGridCell && !children) {
                return child;
            }

            if (child.type != FocusGridCell && children) {
                return React.cloneElement(child, {
                    children: this.traverseChildren(children)
                });
            }
    
            const isFocused = activeColumn == column && activeRow == row;
            return (
                React.cloneElement(child, {
                    activeTabIndex: isFocused ? 0 : -1
                })
            )
        });
    }

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

            const setStateCallback = () => {
                const currentFocusedItem = current.querySelector('[tabindex="0"]');
                currentFocusedItem.focus();
                console.log(currentFocusedItem);
            }

            this.setState({
                activeRow: newFocus.activeRow,
                activeColumn: newFocus.activeColumn
            }, setStateCallback)
        });
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
            >
                {React.Children.map(children, (child) => {
                    const children = child.props.children;
                    const hasChildren = children && children.length && children.length > 0;

                    return (
                        React.cloneElement(child, {
                            ...(hasChildren ? {children: this.traverseChildren(children)} : {})
                        })
                    )
                })}
            </div>
        )
    }
}

export class FocusGridCell extends React.Component {
    constructor(props) {
        super(props);
    }

    // Private cell ref
    _cellRef = React.createRef();

    componentDidMount() {
        // this._cellRef.current.addEventListener('click', () => {
        //     console.log("yooooo");
        // });
        console.log(this._cellRef);
    }

    render() {
        const {
            children,
            className = "",
            cellRef,
            ...additionalProps
        } = this.props;

        const mergedRefs = MergeRefs(this._cellRef, cellRef);

        return (
            <div
                className={"FocusGridCell " + className}
                {...additionalProps}
                ref={mergedRefs}
            >
                {children}
            </div>
        )
    }
}