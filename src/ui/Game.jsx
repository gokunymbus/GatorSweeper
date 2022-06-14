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
import DifficultyButtons from './DifficultyButtons';
import Grid from './Grid';
import Header from './Header';
import Tile from './Tile';

// Library
import {
    DifficultySettings,
    Difficulties,
    GameState,
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

// Utilities
import {FocusGrid, FocusGridCellDataAttribute} from "../utilities/FocusGrid";
import RandomMinMax from '../utilities/RandomMinMax';
import ReplaceStringTokens from "../utilities/ReplaceStringTokens";
import timer from '../utilities/Timer';

// Language
import Language from "../languages/Language";

export default class Game extends React.Component {
    #timerRef = null;
    #timeoutIDs = [];
    #language = Language();

    constructor(props) {
        super(props);
        this.state = this.#getIntialGameState({});
    }

    #addFlag(tileProps) {
        const { row, column } = tileProps;
        const { grid, flags } = this.state;
        const tile = grid[row][column];

        // If there are no flags left or
        // if the tile is already revealed,
        // just return and do nothing.
        if (flags == 0 || tile.isRevealed) {
            return;
        }

        const isFlagged = !tile.isFlagged;
        const newGrid = updateTargetTile({
            targetRow: row,
            targetColumn: column,
            grid,
            tileParams: {
                isFlagged,
            }
        });

        this.setState({
            grid: newGrid,
            flags: isFlagged ?  flags - 1 : flags + 1
        });
    }

    #clearTimeouts() {
        if (this.#timeoutIDs.length > 0) {
            this.#timeoutIDs.forEach((tid) => {
                clearTimeout(tid);
            });
            this.#timeoutIDs = [];
        }
    }

    #createTimer() {
        this.#timerRef = timer(this.#onTimerUpdate);
    }

    #clearTimer() {
        if (this.#timerRef) {
            this.#timerRef.stop();
            this.#timerRef = null;
        }
    }

    #getIntialGameState(defaultOverrides) {
        const {
            defaultDifficulty,
            defaultDifficultySettings,
            defaultTheme
        } = this.props;
        const {
            difficulty = defaultDifficulty,
            difficultySettings = defaultDifficultySettings,
            theme = defaultTheme
        } = defaultOverrides;
    
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

    #onTimerUpdate = (seconds) => {
        this.setState({
            timer: seconds
        });
    };

    #onSetFlag = (tileProps) => {
        this.#addFlag(tileProps);
    };

    #onTileSelected = (tileProps) => {
        this.#selectTile(tileProps);
    };

    #onDifficultySelected(difficulty) {
        this.#resetGame({
            difficultySettings: DifficultySettings[difficulty],
            difficulty
        });
    }

    #onReset = () => {
        const { difficulty, difficultySettings } = this.state;
        this.#resetGame({
            difficulty,
            difficultySettings
        });
    };

    #selectTile(tileProps) {
        const { row, column, isMine, isFlagged } = tileProps;
        const { grid, gameState, difficultySettings } = this.state;
        const { size } = difficultySettings;
        const minStateDelay = 300;
        const maxStateDelay = 1200;

        if (gameState == GameState.ENDED
            || gameState == GameState.WON
            || isFlagged) {
            return;
        }

        if (isMine) {
            // This is to "stagger" updating
            // each mine so they appear to 
            // show up at different times. 
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
                }, RandomMinMax(minStateDelay, maxStateDelay));
                this.#timeoutIDs = this.#timeoutIDs.concat(tid);
            });
        }

        const newGrid = updateGridFromTarget({
            targetRowIndex: row,
            targetColumnIndex: column,
            grid
        });

        const totalMines = numberOfMines(newGrid);
        const totalRevealedTiles = numberOfRevealedTiles(newGrid);
        const remainingTiles = (size * size) - totalRevealedTiles;

        let newGameState;
        switch (true) {
            case isMine:
                newGameState = GameState.ENDED;
                break;
            case remainingTiles == totalMines:
                newGameState = GameState.WON;
                break;
            default:
                newGameState = GameState.RUNNING;
                break;
        }

        const { gameOverTheme } = this.props;
        
        this.setState({
            grid: newGrid,
            gameState: newGameState,
            ...(newGameState == GameState.ENDED && { theme: gameOverTheme })
        });
    }

    #resetGame(initialStateOverrides) {
        this.#clearTimeouts();
        this.#clearTimer();
        this.setState(this.#getIntialGameState(initialStateOverrides));
    }

    componentDidUpdate(previousProps, previousState) {
        const { gameState } = this.state;
        if (gameState == GameState.RUNNING
            && previousState.gameState == GameState.NEW) {
           this.#createTimer();
        }

        if (
            previousState.gameState == GameState.RUNNING
            && gameState == GameState.ENDED
            || gameState == GameState.WON
        ) {
            this.#clearTimer();
        }
    }

    componentWillUnmount() {
        this.#clearTimer();
        this.#clearTimeouts();
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

        const buttons =  [
            {
                difficulty: Difficulties.EASY,
                ariaLabel: this.#language.footerAEDEasy,
                string: this.#language.modesEasy,
                isActive: difficulty === Difficulties.EASY
            },
            {
                difficulty: Difficulties.HARD,
                ariaLabel: this.#language.footerAEDHard,
                string: this.#language.modesHard,
                isActive: difficulty === Difficulties.HARD
            },
            {
                difficulty: Difficulties.EXTREME,
                ariaLabel: this.#language.footerAEDExtreme,
                string: this.#language.modesExtreme,
                isActive: difficulty === Difficulties.EXTREME
            }
        ];

        const headerStates = {
            [GameState.RUNNING]: {
                statusName: this.#language.controlsGameStateStarted,
                ariaDescription: this.#language.controlsAEDGameStateStarted
            },
            [GameState.NEW]: {
                statusName: this.#language.controlsGameStateNew,
                ariaDescription: this.#language.controlsAEDGameStateNew
            },
            [GameState.ENDED]: {
                statusName: this.#language.controlsGameStateFailed,
                ariaDescription: this.#language.controlsAEDGameStateFailed
            },
            [GameState.WON]: {
                statusName: this.#language.controlsGameStateWinner,
                ariaDescription: this.#language.controlsAEDGameStateWinner
            }
        };

        return (
            <main
                className="Game"
                style={theme} 
            >
                <div className="Game__container">
                    <Header
                        onReset={this.#onReset}
                        flags={flags}
                        timer={timer}
                        statusName={headerStates[gameState].statusName}
                        statusAriaDescription={headerStates[gameState].ariaDescription}
                        isGameOver={gameState == GameState.ENDED}
                        isGameWon={gameState == GameState.WON}
                    />
                    <FocusGrid
                        rowLength={grid.length}
                        columnLength={grid[0].length}
                        aria-label={ReplaceStringTokens(
                            this.#language.gridAED, [setFlagKey]
                        )}
                        tabIndex={0}
                        role="application"
                        className="Game__focusGrid"
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
                                        onTileSelected={this.#onTileSelected}
                                        onSetFlag={this.#onSetFlag}
                                        difficulty={difficulty}
                                        htmlAttributes={{
                                            ...FocusGridCellDataAttribute(rowIndex, columnIndex)
                                        }}
                                    />
                                )
                            }}
                        />
                    </FocusGrid>
                    <DifficultyButtons
                        onButtonSelected={this.#onDifficultySelected.bind(this)}
                        buttons={buttons}
                    />
                </div>
            </main>
        );
    }

}
