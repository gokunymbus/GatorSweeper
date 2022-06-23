/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 *
 */

import React from "react";
import "./DifficultyButtons.css";

export const testID = "difficulty-button";

export default class DifficultyButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    #renderButton(button, index) {
        const {onButtonSelected} = this.props;
        const activeClassName = "DifficultyButtons__button--active";
        const {
            difficulty,
            string,
            ariaLabel,
            isActive,
        } = button;
        return (
            <div
                className={`DifficultyButtons__button ${isActive ? activeClassName : ""}`}
                tabIndex={0}
                onClick={(e) => {
                    onButtonSelected(difficulty);
                }}
                onKeyUp={(e) => {
                    if (e.key == "Enter") {
                        onButtonSelected(difficulty);
                        e.stopPropagation();
                        return;
                    }
                }}
                aria-label={ariaLabel}
                key={index}
                role="button"
                data-testid={`${testID}-${difficulty.description}`}
            >
                {string}
            </div>
        )
    }

    render() {
        const {buttons} = this.props;
        return (
            <div className="DifficultyButtons">
                { buttons.map((button, index) => {
                    return this.#renderButton(button, index)
                }) }
            </div>
        )
    }
}
