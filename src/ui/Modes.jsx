import React from "react";
import './Modes.css';
import Language from "../library/Language";

export const Difficulties = {
    "easy": "easy",
    "hard": "hard",
    "extreme": "extreme"
}

export default class Modes extends React.Component {
    lang = Language();
    constructor(props) {
        super(props);
    }

    easyRef = React.createRef();
    hardRef = React.createRef();
    extremeRef = React.createRef();

    componentDidMount() {
        const {onDifficultySelected} = this.props;
        this.easyRef.current.addEventListener('click', (e) => {
            onDifficultySelected(Difficulties.easy);
        });

        this.hardRef.current.addEventListener('click', (e) => {
            onDifficultySelected(Difficulties.hard);
        });

        this.extremeRef.current.addEventListener('click', (e) => {
            onDifficultySelected(Difficulties.extreme);
        });
    }
    
    render() {
        const { difficulty } = this.props;
        return (
            <div className="Modes">
               <div className="Modes__easy" ref={this.easyRef} tabIndex={0}>{this.lang.modesEasy}</div>
               <div className="Modes__hard" ref={this.hardRef} tabIndex={0}>{this.lang.modesHard}</div>
               <div className="Modes__extreme" ref={this.extremeRef} tabIndex={0}>{this.lang.modesExtreme}</div>
            </div>
        )
    }
}
    