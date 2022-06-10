
import React from 'react';
import Grid from './Grid';
import Header from './Header';
import {
    createGridWithProximites,
    numberOfMines,
    numberOfRevealedTiles,
    reduceMines,
    updateGridFromTarget,
    updateTargetTile
} from '../library/Grid';

import themes from '../themes/index.js'
import timer from '../utilities/Timer';
import './Game.css';
import {
    DifficultySettings,
    Difficulties,
    GameState,
    defaultTheme,
    defaultGameOverTheme
} from '../library/Constants';
import Tile from './Tile';
import RandomMinMax from '../utilities/RandomMinMax';
import Footer from './Footer';

export default class Game extends React.Component {
    timerRef = null;
    timeoutIDs = [];

    constructor(props) {
        super(props);
        this.state = this.getIntialGameState({});
    }

    getIntialGameState = (defaults) => {
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

    createTimer = () => {
        this.timerRef = timer(this.onTimerUpdate);
    }

    clearTimer = () => {
        if (this.timerRef) {
            this.timerRef.stop();
            this.timerRef = null;
        }
    }

    clearTimeouts = () => {
        if (this.timeoutIDs.length > 0) {
            this.timeoutIDs.forEach((tid) => {
                clearTimeout(tid);
            });
            this.timeoutIDs = [];
        }
    }

    setGame = (params) => {
        this.clearTimeouts();
        this.clearTimer();
        this.setState(this.getIntialGameState(params));
    }

    selectTile = (tileProps) => {
        const {row, column, isMeow, isFlagged} = tileProps;
        const {grid, gameState, difficultySettings} = this.state;
        const { size } = difficultySettings;

        if (gameState == GameState.ENDED || gameState == GameState.WON || isFlagged) {
            return;
        }

        if (isMeow) {
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
                this.timeoutIDs = this.timeoutIDs.concat(tid);
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
            case isMeow:
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
                    <Grid
                        gridData={grid}
                        gridSize={difficultySettings.size}
                        tileProps={
                            {
                                onTileSelected: this.onTileSelected,
                                onTileRightClicked: this.onTileRightClicked,
                                onEnterKeyUp: this.onEnterKeyUp,
                                difficulty: difficulty,
                                onLongPress: this.onLongPress
                            }
                        }
                    >
                    </Grid>
                    <Footer
                        onDifficultySelected={this.onDifficultySelected}
                        difficulty={difficulty}
                    />
                </div>
            </main>
        );
    }

}