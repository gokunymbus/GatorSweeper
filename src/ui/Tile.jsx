import React from "react";
import "./Tile.css";
import { setFlagKey } from "../library/Constants";
import timer from "../library/Timer";
import Language from "../utilities/Language";
import ReplaceStringTokens from "../utilities/ReplaceStringTokens";
import PropTypes from "prop-types";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.tileRef = props.forwardRef || React.createRef();
    }

    language = Language();
    timer = null;
    intervalsPassed = 0;

    getARIADescription() {
        const {
            isRevealed,
            proximities,
            isMeow,
            isFlagged
        } = this.props

        const {
            tileAEDRevealed,
            tileAEDHidden,
            tileAEDRevealedMine,
            tileAEDIsFlagged
        } = this.language;

        if (isRevealed && isMeow) {
            return tileAEDRevealedMine;
        }

        if (isRevealed) {
            return ReplaceStringTokens(tileAEDRevealed, [proximities])
        }

        if (isFlagged) {
            return tileAEDIsFlagged + " " + tileAEDHidden;
        }

        return tileAEDHidden;
    }

    onClickHandler = (e) => {
        const { onTileSelected } = this.props;
        onTileSelected(e, { ...this.props });
    }

    onContextMenuHandler = (e) => {
        const { onTileRightClicked } = this.props;
        onTileRightClicked(e, { ...this.props });
        e.preventDefault();
    }

    onEnterKeyUp = (e) => {
        const { onEnterKeyUp } = this.props;
        onEnterKeyUp(e, { ...this.props });
    }

    onKeyUpHandler = (e) => {
        if (e.key === "Enter") {
            this.onEnterKeyUp(e);
        }

        if (e.key === setFlagKey) {
            this.onContextMenuHandler(e);
        }
    }

    onLongPress = (e) => {
        const { onLongPress } = this.props;
        onLongPress(e, { ...this.props });
    }

    onTouchStartHandler = (e) => {
        this.timer = timer(intervalsPassed => { this.intervalsPassed = intervalsPassed }, 400);
        e.preventDefault();
    }

    onTouchEndHandler = (e) => {
        if (this.intervalsPassed === 0) {
            this.onClick(e);
        }

        if (this.intervalsPassed > 0) {
            this.onLongPress();
        }

        this.timer.stop();
        this.timer = null;
        this.intervalsPassed = 0;
        e.preventDefault();
    }

    renderMeow() {
        return (<div className="Tile__revealed Tile__revealed--mine"></div>)
    }

    renderProximity(proximities) {
        return (<div className="Tile__revealed Tile__revealed--proximity">{proximities}</div>)
    }

    renderBlank() {
        return (<div className="Tile__revealed Tile__revealed--blank"></div>)
    }

    renderFlag() {
        return (<div className="Tile__covered__flag"></div>)
    }

    renderRevealed() {
        const { proximities, isMeow } = this.props;

        if (isMeow) {
            return this.renderMeow();
        }

        if (proximities > 0) {
            return this.renderProximity(proximities);
        }

        return this.renderBlank();
    }

    renderCovered() {
        const { isFlagged } = this.props;
        return (
            <div className={ "Tile__covered" }>
                { isFlagged && this.renderFlag() }
                <div className="Tile__covered__bg"></div>
            </div>
        );
    }

    render() {
        const {
            isRevealed,
            difficulty,
            row,
            column
        } = this.props;

        // Get description of our symb enum
        const difficultyClassName = "Tile--" + difficulty.description;
        const aedTileDescription = this.getARIADescription() + " " + ReplaceStringTokens(
            this.language.tileAED, [row, column]
        );

        return (
            <div
                className={ `Tile ${difficultyClassName}` }
                ref={this.tileRef}
                aria-label={aedTileDescription}
                onClick={this.onClickHandler}
                onContextMenu={this.onContextMenuHandler}
                onKeyUp={this.onKeyUpHandler}
                onTouchStart={this.onTouchStartHandler}
                onTouchEnd={this.onTouchEndHandler}
            >
                {
                    isRevealed
                        ? this.renderRevealed()
                        : this.renderCovered()
                }
            </div>
        )
    }
}

Tile.propTypes = {
    // React ref
    forwardRef: PropTypes.any,
    isRevealed: PropTypes.bool,
    proximities: PropTypes.number,
    isMeow: PropTypes.bool,
    isFlagged: PropTypes.bool,
    row: PropTypes.number,
    column: PropTypes.number,
    difficulty: PropTypes.symbol,
    onTileSelected: PropTypes.func,
    onTileRightClicked: PropTypes.func,
    onEnterKeyUp: PropTypes.func,
    onLongPress: PropTypes.func
}
