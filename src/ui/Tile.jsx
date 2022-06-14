/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 * 
 */

// React
import React from "react";

//CSS
import "./Tile.css";

// Language
import Language from "../languages/Language";

// Library
import { setFlagKey, selectTileKey } from "../library/Constants";

// Utilities
import ReplaceStringTokens from "../utilities/ReplaceStringTokens";
import timer from "../utilities/Timer";

export const testID = "tile";

export default class Tile extends React.Component {
    // Private Properties
    #tileRef = React.createRef();
    #language = Language();
    #timer = null;
    #intervalsPassed = 0;
    #timeUntilLongPress = 400;

    constructor(props) {
        super(props);
    }

    // Private Methods
    #getARIADescription() {
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
        } = this.#language;

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

    #onClickHandler = (e) => {
        const { onTileSelected } = this.props;
        onTileSelected({ ...this.props });
    }

    #onContextMenuHandler = (e) => {
        const { onSetFlag } = this.props;
        onSetFlag({ ...this.props });
        e.preventDefault();
    }

    #onKeyUpHandler = (e) => {
        const { onSetFlag, onTileSelected } = this.props;
        if (e.key === selectTileKey) {
            onTileSelected({ ...this.props });
            return;
        }

        if (e.key === setFlagKey) {
            onSetFlag({ ...this.props });
            return;
        }
    }

    #onTouchEndHandler = (e) => {
        if (e.touches.length > 1) {
            return;
        }

        const { onTileSelected, onSetFlag } = this.props;

        if (this.#intervalsPassed === 0) {
            onTileSelected({ ...this.props });
        }

        if (this.#intervalsPassed > 0) {
            onSetFlag({ ...this.props });
        }

        this.#resetTimer();
    }

    #onTouchStartHandler = (e) => {
        if (e.touches.length > 1) {
            return;
        }

        this.timer = timer(intervalsPassed => {
            this.#intervalsPassed = intervalsPassed
        }, this.#timeUntilLongPress);
    }

    #renderBlank() {
        return (
            <div
                className="Tile__revealed Tile__revealed--blank"
                data-testid={`${testID}-revealed-blank`}
            />
        )
    }

    #renderCovered() {
        const { isFlagged } = this.props;
        return (
            <div className={ "Tile__covered" } data-testid={`${testID}-covered`}>
                { isFlagged && this.#renderFlag() }
                <div className="Tile__covered__bg"></div>
            </div>
        );
    }

    #renderFlag() {
        return (
            <div
                className="Tile__covered__flag"
                data-testid={`${testID}-covered-flag`}
            />
        )
    }

    #renderMine() {
        return (
            <div
                className="Tile__revealed Tile__revealed--mine"
                data-testid={`${testID}-revealed-mine`}
            />
        )
    }

    #renderProximity(proximities) {
        return (
            <div className="Tile__revealed Tile__revealed--proximity">
                <div
                    className="Tile__revealed__proximityNumber"
                    data-testid={`${testID}-proximity-number`}
                >
                    {proximities}
                </div>
            </div>
        )
    }

    #renderRevealed() {
        const { proximities, isMine } = this.props;

        if (isMine) {
            return this.#renderMine();
        }

        if (proximities > 0) {
            return this.#renderProximity(proximities);
        }

        return this.#renderBlank();
    }

    #resetTimer() {
        if (this.#timer) {
            this.#timer.stop();
            this.#timer = null;
            this.#intervalsPassed = 0;
        }
    }

    // Public Methods
    render() {
        const {
            isRevealed,
            difficulty,
            row,
            column,
            htmlAttributes
        } = this.props;

        const difficultyClassName = "Tile--" + difficulty.description;
        const aedTileDescription = this.#getARIADescription() + " " + ReplaceStringTokens(
            this.#language.tileAED, [row, column]
        );

        return (
            <div
                className={ `Tile ${difficultyClassName}` }
                data-testid={`${testID}`}
                ref={this.#tileRef}
                aria-label={aedTileDescription}
                onClick={this.#onClickHandler}
                onContextMenu={this.#onContextMenuHandler}
                onKeyUp={this.#onKeyUpHandler}
                onTouchStart={this.#onTouchStartHandler}
                onTouchEnd={this.#onTouchEndHandler}
                tabIndex={0}
                {...htmlAttributes}
            >
                {
                    isRevealed
                        ? this.#renderRevealed()
                        : this.#renderCovered()
                }
            </div>
        )
    }
}