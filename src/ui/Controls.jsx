import React from "react";
import './Controls.css';

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
        const { flags, timer, isGameOver } = this.props;
        const gameOverClassName = isGameOver ? "Controls__action--gameover": "";
        return (
            <div className="Controls">
                <div className="Controls__flags">{flags}</div>
                <div className={`Controls__action ${gameOverClassName}`} ref={this.actionRef}></div>
                <div className="Controls__timer" ref={this.timerRef}>{timer}</div>
            </div>
        )
    }
}
    