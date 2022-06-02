import React from "react";
import './Controls.css';
import { GameState } from "../library/Constants";

export default class Controls extends React.Component {
    constructor(props) {
        super(props);
    }

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
        const gameOverClassName = gameState == GameState.ENDED ? "Controls__action--gameover": "";

        return (
            <div className="Controls">
                <div className="Controls__flags">{flags}</div>
                <div className="Controls__status" ref={this.actionRef}>
                    <div className={`Controls__action ${gameOverClassName}`}></div>
                    <div className="Controls__statusText">Started</div>
                </div>
                <div className="Controls__timer" ref={this.timerRef}>{timer}</div>
            </div>
        )
    }
}
    