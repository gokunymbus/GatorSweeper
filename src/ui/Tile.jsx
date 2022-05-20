import React from "react";
import "./Tile.css";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
    }
    
    tileRef = React.createRef();

    onClick = (e) => {
        const {onTileSelected} = this.props;
        console.log("Tile selected", this.props.isMeow);
        onTileSelected(e, {...this.props});
    }

    renderMeow() {
        return (<div className="Tile__meow"></div>)
    }

    renderProximity(proximities) {
        return (<div className="Tile__proximity">{proximities}</div>)
    }

    renderBlank() {
        return (<div className="Tile__blank"></div>)
    }

    renderRevealed() {
        const {proximities, isMeow, isRevealed} = this.props;

        if (isMeow) {
            return this.renderMeow();
        }

        if (proximities > 0) {
            return this.renderProximity(proximities);
        }

        return this.renderBlank();
    }

    renderCovered() {
        return (<div class="Tile__covered"></div>);
    }

    componentDidMount() {
        this.tileRef.current.addEventListener('click', (e) => {
            this.onClick(e);
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