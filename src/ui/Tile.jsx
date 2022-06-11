import React from "react";
import "./Tile.css";
import Language from "../languages/Language";
import timer from "../utilities/Timer";
import { setFlagKey, selectTileKey } from "../library/Constants";
import ReplaceStringTokens from "../utilities/ReplaceStringTokens";

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
            isMine,
            isFlagged
        } = this.props

        const {
            tileAEDRevealed,
            tileAEDHidden,
            tileAEDRevealedMine,
            tileAEDIsFlagged
        } = this._language;

        if (isRevealed && isMine) {
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
        if (e.key === selectTileKey) {
            this.onEnterKeyUp(e);
            return;
        }

        if (e.key === setFlagKey) {
            this.onContextMenuHandler(e);
            return;
        }
    }

    onTouchStartHandler = (e) => {
        this.timer = timer(intervalsPassed => { this._intervalsPassed = intervalsPassed }, 400);
        e.preventDefault();
    }

    onTouchEndHandler = (e) => {
        const { onTileSelected, onLongPress } = this.props;

        if (this._intervalsPassed === 0) {
            onTileSelected(e, { ...this.props });
        }

        if (this._intervalsPassed > 0) {
            onLongPress(e, { ...this.props });
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

    renderMine() {
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
        const { proximities, isMine } = this.props;

        if (isMine) {
            return this.renderMine();
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
                tabIndex={0}
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