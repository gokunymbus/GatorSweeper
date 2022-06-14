import React from "react";
import './Header.css';
import Language from "../languages/Language";

export default class Header extends React.Component {
    #language = Language();
    #statusActiveClassName = "Header__statusText__status--animated";
    #animationDelay = 100;
    #statusRef = React.createRef();

    constructor(props) {
        super(props);
    }

    #onClickHandler = (e) => {
        const { onReset } = this.props;
        onReset();
        e.target.blur();
    }

    componentDidUpdate(prevProps) {
        const { statusName } = this.props;
        const { current } = this.#statusRef;
        if (statusName != prevProps.statusName) {
            current.classList.remove(this.#statusActiveClassName);
            setTimeout(() => {
                current.classList.add(this.#statusActiveClassName);
            }, this.#animationDelay)
        }
    }

    render() {
        const {
            flags,
            timer,
            isGameWon,
            isGameOver,
            statusName,
            statusAriaDescription
        } = this.props;

        const {
            controlsNumberOfFlags,
            controlsResetButton,
            controlsSeconds
        } = this.#language;

        const gameStateClassName = isGameOver
            ? "Header__action--gameover" : isGameWon
                ? "Header__action--gamewon" : ""

        return (
            <div className="Header">
                <div
                    className="Header__flags"
                    aria-label={controlsNumberOfFlags + " " + flags}
                    tabIndex={0}
                >
                    {flags}
                </div>
                <div className="Header__status">
                    <button
                        className={`Header__action ${gameStateClassName}`}
                        onClick={this.#onClickHandler}
                        aria-label={controlsResetButton}
                        tabIndex={0}
                    />
                    <div
                        className="Header__statusText"
                        aria-label={statusAriaDescription}
                        aria-live="passive"
                    >
                        <div
                            className={`Header__statusText__status ${this.#statusActiveClassName}`}
                            aria-hidden="true"
                            ref={this.#statusRef}
                        >
                            { statusName }
                        </div>
                    </div>
                </div>
                <div
                    className="Header__timer"
                    ref={this.timerRef}
                    aria-label={timer + " " + controlsSeconds}
                    role="timer"
                    tabIndex={0}
                >
                    {timer}
                </div>
            </div>
        )
    }
}
    