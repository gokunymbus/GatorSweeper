import React from "react";
import './Controls.css';
import { GameState } from "../library/Constants";
import Language from "../library/Language";

export default class Controls extends React.Component {
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
        const gameOverClassName = isGameOver ? "Controls__action--gameover": "";
        const gameWonClassName = isGameWon ? "Controls__action--gamewon": "";
        const statusTextClassName = "Controls__statusText__status--visible";

        return (
            <div className="Controls">
                <div className="Controls__flags">{flags}</div>
                <div className="Controls__status">
                    <div className={`Controls__action ${gameOverClassName} ${gameWonClassName}`}  ref={this.actionRef}></div>
                    <div className="Controls__statusText">
                        <div className={`Controls__statusText__status ${isGameRunning ? statusTextClassName : ""}`}>{this.language.controlsGameStateStarted}</div>
                        <div className={`Controls__statusText__status ${isGameOver ? statusTextClassName : ""}`}>{this.language.controlsGameStateFailed}</div>
                        <div className={`Controls__statusText__status ${isGameNew ? statusTextClassName : ""}`}>{this.language.controlsGameStateNew}</div>
                        <div className={`Controls__statusText__status ${isGameWon ? statusTextClassName : ""}`}>{this.language.controlsGameStateWinner}</div>
                    </div>
                </div>
                <div className="Controls__timer" ref={this.timerRef}>{timer}</div>
            </div>
        )
    }
}
    