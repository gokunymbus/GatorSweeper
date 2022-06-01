import React from "react";
import "./Tile.css";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
    }
    
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

    renderMeow() {
        return (<div className="Tile__mine"></div>)
    }

    renderProximity(proximities) {
        return (<div className="Tile__proximity">{proximities}</div>)
    }

    renderBlank() {
        return (<div className="Tile__blank"></div>)
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
        const {isFlagged} = this.props;
        return (
            <div className={`Tile__covered ${(isFlagged) ? 'Tile__covered--isFlagged' : '' }`}></div>
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
    }

    render() {
        const {isRevealed} = this.props;
        return(
            <div className="Tile" ref={this.tileRef} tabIndex={0}>
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