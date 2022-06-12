/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 * 
 */

// React
import React from 'react';

// Styles
import './Game.css';

// Components
import Footer from './Footer';
import Grid from './Grid';
import Header from './Header';
import Tile from './Tile';

// Library
import {
    DifficultySettings,
    Difficulties,
    GameState,
    defaultTheme,
    defaultGameOverTheme,
    setFlagKey
} from '../library/Constants';
import {
    createGridWithProximites,
    numberOfMines,
    numberOfRevealedTiles,
    reduceMines,
    updateGridFromTarget,
    updateTargetTile
} from '../library/Grid';

// Themes
import themes from '../themes/index.js'

// Utilities
import {FocusGrid, FocusGridCellDataAttribute} from "../utilities/FocusGrid";
import RandomMinMax from '../utilities/RandomMinMax';
import ReplaceStringTokens from "../utilities/ReplaceStringTokens";
import timer from '../utilities/Timer';

// Language
import Language from "../languages/Language";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getIntialGameState({});
        this._timerRef = null;
        this._timeoutIDs = [];
        this._language = Language();
    }

    getIntialGameState(defaults) {
        const {
            difficulty = Difficulties.EASY,
            difficultySettings = DifficultySettings[Difficulties.EASY],
            theme = themes[defaultTheme]
        } = defaults;
    
        return {
            grid: createGridWithProximites({
                gridSize: difficultySettings.size,
                randomMin: difficultySettings.minMines,
                randomMax: difficultySettings.maxMines
            }),
            flags: difficultySettings.flags,
            timer: 0,
            gameState: GameState.NEW,
            difficultySettings,
            difficulty,
            theme: theme
        }
    }

    createTimer() {
        this._timerRef = timer(this.onTimerUpdate);
    }

    clearTimer() {
        if (this._timerRef) {
            this._timerRef.stop();
            this._timerRef = null;
        }
    }

    clearTimeouts() {
        if (this._timeoutIDs.length > 0) {
            this._timeoutIDs.forEach((tid) => {
                clearTimeout(tid);
            });
            this._timeoutIDs = [];
        }
    }

    setGame(params) {
        this.clearTimeouts();
        this.clearTimer();
        this.setState(this.getIntialGameState(params));
    }

    selectTile(tileProps) {
        const {row, column, isMine, isFlagged} = tileProps;
        const {grid, gameState, difficultySettings} = this.state;
        const { size } = difficultySettings;

        if (gameState == GameState.ENDED || gameState == GameState.WON || isFlagged) {
            return;
        }

        if (isMine) {
            // Here we update one mine at a time
            // by picking one out of the Grid and then
            // delaying when the state receives the update
            const mines = reduceMines(grid);
            mines.forEach((mine) => {
                const tid = setTimeout(() => {
                    this.setState((previousState) => {
                        const newGrid = updateTargetTile({
                            targetRow: mine.row,
                            targetColumn: mine.column,
                            grid: previousState.grid,
                            tileParams: {
                                isRevealed: true
                            }
                        });
    
                        return {grid: newGrid}
                    });
                }, RandomMinMax(300, 1200));
                this._timeoutIDs = this._timeoutIDs.concat(tid);
            });
        }

        const newGrid = updateGridFromTarget({
            targetRowIndex: row,
            targetColumnIndex: column,
            grid
        });

        
        let newGameState;
        const totalMines = numberOfMines(newGrid);
        const totalRevealedTiles = numberOfRevealedTiles(newGrid);
        const tilesLeft = (size * size) - totalRevealedTiles;
    
        switch (true) {
            case isMine:
                newGameState = GameState.ENDED;
                break;
            case tilesLeft == totalMines:
                newGameState = GameState.WON;
                break;
            default:
                newGameState = GameState.RUNNING;
                break;
        }
        
        this.setState({
            grid: newGrid,
            gameState: newGameState,
            ...(newGameState == GameState.ENDED && {theme: themes[defaultGameOverTheme]})
        });
    }

    onTimerUpdate = (seconds) => {
        this.setState({
            timer: seconds
        });
    };

    addFlag(tileProps) {
        const {row, column} = tileProps;
        const {grid, flags} = this.state;
        const tile = grid[row][column];

        // If there are no flags left, don't place them
        if (flags == 0 || tile.isRevealed) {
            return;
        }

        const isFlagged = !tile.isFlagged;
        const newGrid = updateTargetTile({
            targetRow: row,
            targetColumn: column,
            grid,
            tileParams: {
                isFlagged
            }
        });

        this.setState({
            grid: newGrid,
            flags: isFlagged ?  flags - 1 : flags + 1
        });
    }

    onTileRightClicked = (e, tileProps) => {
        this.addFlag(tileProps);
    };

    onEnterKeyUp = (e, tileProps) => {
        this.selectTile(tileProps);
    };

    onTileSelected = (e, tileProps) => {
        this.selectTile(tileProps);
    };

    onLongPress = (e, tileProps) => {
        this.addFlag(tileProps);
    };

    onMainIconSelected = () => {
        // Maintain current diffuculty
        const {difficulty, difficultySettings} = this.state;
        this.setGame({
            difficulty,
            difficultySettings
        });
    };

    componentDidUpdate(previousProps, previousState) {
        const { gameState, theme } = this.state;
        if (gameState == GameState.RUNNING && previousState.gameState == GameState.NEW) {
           this.createTimer();
        }

        if (
            previousState.gameState == GameState.RUNNING
            && gameState == GameState.ENDED
            || gameState == GameState.WON
        ) {
            this.clearTimer();
        }
    }

    onDifficultySelected = (difficulty) => {
        this.setGame({
            difficultySettings: DifficultySettings[difficulty],
            difficulty
        });
    }

    render() {
        const {
            grid,
            flags,
            timer,
            gameState,
            difficultySettings,
            difficulty,
            theme
        } = this.state;

        const formatedGridAED = ReplaceStringTokens(this._language.gridAED, [setFlagKey]);

        return (
            <main
                className="Game"
                style={theme}
            >
                <div className="Game__container">
                    <Header
                        onMainIconSelected={this.onMainIconSelected}
                        flags={flags}
                        timer={timer}
                        gameState={gameState}
                    />
                    <FocusGrid
                        rowLength={grid.length}
                        columnLength={grid[0].length}
                        aria-label={formatedGridAED}
                        tabIndex={0}
                        role={"application"}
                    >
                        <Grid
                            gridData={grid}
                            gridSize={difficultySettings.size}
                            renderCell={(rowIndex, columnIndex, data) => {
                                return (
                                    <Tile
                                        row={rowIndex}
                                        column={columnIndex}
                                        {...data}
                                        onTileSelected={this.onTileSelected}
                                        onTileRightClicked={this.onTileRightClicked}
                                        onEnterKeyUp={this.onEnterKeyUp}
                                        difficulty={difficulty}
                                        onLongPress={this.onLongPress}
                                        htmlAttributes={{
                                            ...FocusGridCellDataAttribute(rowIndex, columnIndex)
                                        }}
                                    />
                                )
                            }}
                        />
                    </FocusGrid>
                    <Footer
                        onDifficultySelected={this.onDifficultySelected}
                        difficulty={difficulty}
                    />
                </div>
            </main>
        );
    }

}