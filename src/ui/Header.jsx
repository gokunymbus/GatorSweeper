import React from "react";
import './Header.css';
import { GameState } from "../library/Constants";
import Language from "../library/Language";

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

        return (
            <header className="Header">
                <div className="Header__flags">{flags}</div>
                <div className="Header__status">
                    <div className={`Header__action ${gameOverClassName} ${gameWonClassName}`} ref={this.actionRef}></div>
                    <div className="Header__statusText">
                        <div className={`Header__statusText__status ${isGameRunning ? statusTextClassName : ""}`}>{this.language.HeaderGameStateStarted}</div>
                        <div className={`Header__statusText__status ${isGameOver ? statusTextClassName : ""}`}>{this.language.HeaderGameStateFailed}</div>
                        <div className={`Header__statusText__status ${isGameNew ? statusTextClassName : ""}`}>{this.language.HeaderGameStateNew}</div>
                        <div className={`Header__statusText__status ${isGameWon ? statusTextClassName : ""}`}>{this.language.HeaderGameStateWinner}</div>
                    </div>
                </div>
                <time className="Header__timer" ref={this.timerRef}>{timer}</time>
            </header>
        )
    }
}
    