import React from "react";
import './Controls.css';

export default class Controls extends React.Component {
    constructor(props) {
        super(props);
    }

    actionRef = React.createRef();
    timerRef = React.createRef();

    componentDidMount() {
        const {onActionSelected} = this.props;
        this.actionRef.current.addEventListener('click', (e) => {
            onActionSelected(e)
        });
    }
    
    render() {
        const { flags, timer } = this.props;
        return (
            <div className="Controls">
                <div className="Controls__flags">{flags}</div>
                <div className="Controls__action" ref={this.actionRef}></div>
                <div className="Controls__timer" ref={this.timerRef}>{timer}</div>
            </div>
        )
    }
}
    