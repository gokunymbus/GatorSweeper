import React from "react";
import "./Tile.css";
import { Difficulties } from "../library/Constants";
import timer from "../library/Timer";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
    }

    timer = null;
    intervalsPassed = 0;
    tileRef = React.createRef();

    onClick = (e) => {
        const {onTileSelected} = this.props;
        onTileSelected(e, {...this.props});
    }

    onRightClick = (e) => {
        const {onTileRightClicked} = this.props;
        onTileRightClicked(e, {...this.props});
        e.preventDefault();
    }

    onEnterKeyUp = (e) => {
        const {onEnterKeyUp} = this.props;
        onEnterKeyUp(e, {...this.props});
    }

    onLongPress = (e) => {
        const {onLongPress} = this.props;
        onLongPress(e, {...this.props});
    }

    renderMeow() {
        return (<div className="Tile__mine"></div>)
    }

    renderProximity(proximities) {
        return (<div className="Tile__proximity">{proximities}</div>)
    }

    renderBlank() {
        return (<div className="Tile__blank"></div>)
    }

    renderFlag() {
        return (<div className="Tile__covered__flag"></div>)
    }

    renderRevealed() {
        const {proximities, isMeow} = this.props;

        if (isMeow) {
            return this.renderMeow();
        }

        if (proximities > 0) {
            return this.renderProximity(proximities);
        }

        return this.renderBlank();
    }

    renderCovered() {
        const { isFlagged } = this.props;
        return (
            <div className={`Tile__covered`} >
                { isFlagged && this.renderFlag() }
                <div className="Tile__covered__bg"></div>
            </div>
        );
    }

    componentDidMount() {
        this.tileRef.current.addEventListener('click', (e) => {
            this.onClick(e);
        });

        this.tileRef.current.addEventListener('contextmenu', (e) => {
            this.onRightClick(e);
        });

        this.tileRef.current.addEventListener('keyup', (e) => {
            if (e.key == "Enter") {
                this.onEnterKeyUp(e);
            }
        });

        this.tileRef.current.addEventListener('touchstart', (e) => {
            this.timer = timer((intervalsPassed) => {this.intervalsPassed = intervalsPassed;}, 400);
            e.preventDefault();
        });

        this.tileRef.current.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        this.tileRef.current.addEventListener('touchend', (e) => {
            if (this.intervalsPassed == 0) {
                this.onClick(e);
            }

            if (this.intervalsPassed > 0) {
                this.onLongPress();
            }

            this.timer.stop();
            this.timer = null;
            this.intervalsPassed = 0;
            e.preventDefault();
        });
    }

    render() {
        const { isRevealed, difficulty } = this.props;

        let difficultyClassName = "";
        switch (difficulty) {
            case Difficulties.EASY:
                difficultyClassName = "Tile--easy"
                break;

            case Difficulties.HARD:
                difficultyClassName = "Tile--hard"
                break;

            case Difficulties.EXTREME:
                difficultyClassName = "Tile--extreme"
                break;

            default:
                break;
        }

        return(
            <div className={`Tile ${difficultyClassName}`} ref={this.tileRef} tabIndex={0}>
                {   
                    isRevealed ?
                    this.renderRevealed()
                    :
                    this.renderCovered()
                }
            </div>
        )
    }
}