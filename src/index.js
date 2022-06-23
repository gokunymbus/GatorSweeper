import React from "react";
import {createRoot} from "react-dom/client";

import Game from "./ui/Game";

// Themes
import themes from "./themes/index.js"

// Import cs Variables
import "./ui/Variables.css";
import "./index.css";

import {
    DifficultySettings,
    Difficulties,
} from "./library/Constants";

function init() {
    const root = createRoot(
        document.getElementById("app-container"),
    );

    const difficulty = Difficulties.EASY;
    const element = <Game
        defaultDifficulty={difficulty}
        difficultySettings={DifficultySettings}
        defaultTheme={themes.main}
        gameOverTheme={themes.gameover}
        gameWonTheme={themes.won}
    />;

    root.render(element);
}

init();
