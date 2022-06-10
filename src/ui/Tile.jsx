import React from "react";
import "./Tile.css";
import Language from "../languages/Language";
import timer from "../utilities/Timer";
import { setFlagKey } from "../library/Constants";
import ReplaceStringTokens from "../utilities/ReplaceStringTokens";
import PropTypes from "prop-types";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this._tileRef = props.forwardRef || React.createRef();
        this._language = Language();
        this._timer = null;
        this._intervalsPassed = 0;
    }

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
        } = this._language;

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
        if (e.targetTouches.length > 1) {
            return;
        }

        this.timer = timer(intervalsPassed => { this._intervalsPassed = intervalsPassed }, 400);
        e.preventDefault();
    }

    onTouchEndHandler = (e) => {
        if (this._intervalsPassed === 0) {
            this.onClickHandler(e);
        }

        if (this._intervalsPassed > 0) {
            this.onLongPress();
        }

        this.resetTimer();
        e.preventDefault();
    }

    resetTimer() {
        if (this._timer) {
            this._timer.stop();
            this._timer = null;
            this._intervalsPassed = 0;
        }
    }

    renderMeow() {
        return (<div className="Tile__revealed Tile__revealed--mine"></div>)
    }

    renderProximity(proximities) {
        return (
            <div className="Tile__revealed Tile__revealed--proximity">
                <div className="Tile__revealed__proximityNumber">{proximities}</div>
            </div>
        )
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

        const difficultyClassName = "Tile--" + difficulty.description;
        const aedTileDescription = this.getARIADescription() + " " + ReplaceStringTokens(
            this._language.tileAED, [row, column]
        );

        return (
            <div
                className={ `Tile ${difficultyClassName}` }
                ref={this._tileRef}
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
    row: PropTypes.number.isRequired,
    column: PropTypes.number.isRequired,
    difficulty: PropTypes.symbol.isRequired,
    onTileSelected: PropTypes.func.isRequired,
    onTileRightClicked: PropTypes.funcisRequired,
    onEnterKeyUp: PropTypes.func.funcisRequired,
    onLongPress: PropTypes.func.funcisRequired
}
