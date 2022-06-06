import React from "react";
import './Header.css';
import { GameState } from "../library/Constants";
import Language from "../utilities/Language";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    language = Language();
    actionRef = React.createRef();
    timerRef = React.createRef();

    componentDidMount() {
        const {onMainIconSelected} = this.props;
        this.actionRef.current.addEventListener('click', (e) => {
            onMainIconSelected(e)
        });
    }
    
    render() {
        const { flags, timer, gameState } = this.props;

        const isGameRunning = gameState == GameState.RUNNING;
        const isGameNew = gameState == GameState.NEW;
        const isGameOver = gameState == GameState.ENDED;
        const isGameWon = gameState == GameState.WON;

        const gameOverClassName = isGameOver ? "Header__action--gameover": "";
        const gameWonClassName = isGameWon ? "Header__action--gamewon": "";
        const statusTextClassName = "Header__statusText__status--visible";

        let extendedDescription = "";
        switch (true) {
            case isGameRunning:
                extendedDescription = this.language.controlsAEDGameStateStarted;
                break;
            case isGameNew:
                extendedDescription = this.language.controlsAEDGameStateNew;
                break;
            case isGameOver:
                extendedDescription = this.language.controlsAEDGameStateFailed;
                break;
            case isGameWon:
                extendedDescription = this.language.controlsAEDGameStateWinner;
                break;

            default:
                break;
        }

        return (
            <header className="Header" aria-label="This is a minesweeper clone">
                <data
                    className="Header__flags"
                    aria-label={this.language.controlsNumberOfFlags + " " + flags}
                    tabIndex={0}
                >{flags}</data>
                <div className="Header__status">
                    <button
                        className={`Header__action ${gameOverClassName} ${gameWonClassName}`}
                        ref={this.actionRef}
                        aria-label={this.language.controlsResetButton}
                        tabIndex={0}
                    ></button>
                    <div className="Header__statusText" aria-label={extendedDescription} aria-live="passive">
                        <div
                            className={`Header__statusText__status ${isGameRunning ? statusTextClassName : ""}`}
                            aria-hidden="true"
                        >
                            {this.language.controlsGameStateStarted}
                        </div>
                        <div
                            className={`Header__statusText__status ${isGameOver ? statusTextClassName : ""}`}
                            aria-hidden="true"
                        >
                            {this.language.controlsGameStateFailed}
                        </div>
                        <div
                            className={`Header__statusText__status ${isGameNew ? statusTextClassName : ""}`}
                            aria-hidden="true"
                        >
                            {this.language.controlsGameStateNew}
                        </div>
                        <div
                            className={`Header__statusText__status ${isGameWon ? statusTextClassName : ""}`}
                            aria-hidden="true"
                        >
                            {this.language.controlsGameStateWinner}
                        </div>
                    </div>
                </div>
                <data
                    className="Header__timer"
                    ref={this.timerRef}
                    aria-label={timer + " " + this.language.controlsSeconds}
                    role="timer"
                    tabIndex={0}
                   >{timer}</data>
            </header>
        )
    }
}
    