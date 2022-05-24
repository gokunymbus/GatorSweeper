import React from "react";
import './Controls.css';
import Defaults from "../library/Defaults";

export default class Controls extends React.Component {
    constructor(props) {
        super(props);
    }

    actionRef = React.createRef();

    componentDidMount() {
        const {onActionSelected} = this.props;
        this.actionRef.current.addEventListener('click', (e) => {
            onActionSelected(e)
        });
    }
    
    render() {
        const { flags } = this.props;

        return (
            <div className="Controls">
                <div className="Controls__flags">{flags}</div>
                <div className="Controls__action" ref={this.actionRef}></div>
                <div className="Controls__timer">{}</div>
            </div>
        )
    }
}
    