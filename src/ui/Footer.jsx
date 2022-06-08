import React from "react";
import './Footer.css';
import Language from "../utilities/Language";
import { Difficulties } from "../library/Constants";

export default class Footer extends React.Component {
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
        const activeClassName = 'Footer__mode--active';
        return (
            <footer className="Footer">
               <div
                    className={`Footer__mode ${difficulty == Difficulties.EASY ? activeClassName : ''}`}
                    ref={this.easyRef}
                    tabIndex={0}
                >
                    {this.lang.modesEasy}
                </div>
                <div
                     className={`Footer__mode ${difficulty == Difficulties.HARD ? activeClassName : ''}`}
                    ref={this.hardRef}
                    tabIndex={0}
                >
                    {this.lang.modesHard}
                </div>
                <div
                     className={`Footer__mode ${difficulty == Difficulties.EXTREME ? activeClassName : ''}`}
                    ref={this.extremeRef}
                    tabIndex={0}
                >
                    {this.lang.modesExtreme}
                </div>
            </footer>
        )
    }
}
    