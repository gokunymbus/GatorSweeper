import React from "react";
import './Modes.css';
import Language from "../library/Language";
import { Difficulties } from "../library/Constants";

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
            onDifficultySelected(Difficulties.EASY);
        });

        this.hardRef.current.addEventListener('click', (e) => {
            onDifficultySelected(Difficulties.HARD);
        });

        this.extremeRef.current.addEventListener('click', (e) => {
            onDifficultySelected(Difficulties.EXTREME);
        });
    }
    
    render() {
        const { difficulty } = this.props;
        return (
            <div className="Modes">
               <div
                    className="Modes__easy"
                    ref={this.easyRef}
                    tabIndex={0}
                >
                    {this.lang.modesEasy}
                </div>
                <div
                    className="Modes__hard"
                    ref={this.hardRef}
                    tabIndex={0}
                >
                    {this.lang.modesHard}
                </div>
                <div
                    className="Modes__extreme"
                    ref={this.extremeRef}
                    tabIndex={0}
                >
                    {this.lang.modesExtreme}
                </div>
            </div>
        )
    }
}
    