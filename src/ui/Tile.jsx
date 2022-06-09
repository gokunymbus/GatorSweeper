import React from "react";
import "./Tile.css";
import { Difficulties, setFlagKey } from "../library/Constants";
import timer from "../library/Timer";
import Language from "../utilities/Language";
import ReplaceStringTokens from "../utilities/ReplaceStringTokens";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.tileRef = props.forwardRef || React.createRef();
    }

    language = Language();
    timer = null;
    intervalsPassed = 0;

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

    // @TODO Need to clear everything on unmount. 
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

            if (e.key == setFlagKey) {
                this.onRightClick(e);
            }
        });

        this.tileRef.current.addEventListener('touchstart', (e) => {
            this.timer = timer((intervalsPassed) => {this.intervalsPassed = intervalsPassed;}, 400);
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

        console.log("Tile - mounted")
    }

    getAEDStatus() {
        const {
            isRevealed,
            proximities,
            isMeow,
            isFlagged
        } = this.props

        const {
            tileAEDRevealed,
            tileAEDHidden,
            tileAEDRevealedMine,
            tileAEDIsFlagged
        } = this.language;

        if (isRevealed && isMeow) {
            return tileAEDRevealedMine;
        }

        if (isRevealed) {
            return ReplaceStringTokens(tileAEDRevealed, [proximities])
        }

        if (isFlagged) {
            return tileAEDIsFlagged + " " + tileAEDHidden;
        }

        return tileAEDHidden;
    }

    render() {
        const {
            isRevealed,
            difficulty,
            row,
            column
        } = this.props;

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

        const aedTileDescription = this.getAEDStatus() + " " + ReplaceStringTokens(
            this.language.tileAED,
            [row,column]
        );

        return(
            <div
                className={`Tile ${difficultyClassName}`}
                ref={this.tileRef}
                aria-label={aedTileDescription}
            >
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