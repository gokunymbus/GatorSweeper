import React from "react";
import './Modes.css';

export default class Modes extends React.Component {
    constructor(props) {
        super(props);
    }

    actionRef = React.createRef();
    timerRef = React.createRef();

    componentDidMount() {
        // const {onMainIconSelected} = this.props;
        // this.actionRef.current.addEventListener('click', (e) => {
        //     onMainIconSelected(e)
        // });
    }
    
    render() {

        return (
            <div className="Modes">
               <div className="Modes__easy"></div>
               <div className="Modes__hard"></div>
               <div className="Modes__extreme"></div>
            </div>
        )
    }
}
    