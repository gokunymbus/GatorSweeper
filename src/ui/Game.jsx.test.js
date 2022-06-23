/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 *
 */

import React from "react";
import Game from "./Game";
import {testID as tileTestID} from "./Tile";
import {testID as headerTestID} from "./Header";
import {testID as diffButtonTestID} from "./DifficultyButtons";
import * as constants from "../library/Constants";
import * as themes from "../themes/index";

import {render, cleanup, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import * as GridAPI from "../library/Grid";

const testData = [
    [
        {
            "isMine": false,
            "isRevealed": false,
            "isFlagged": false,
            "proximities": 1,
        },
        {
            "isMine": false,
            "isRevealed": false,
            "isFlagged": false,
            "proximities": 1,
        },
    ],
    [
        {
            "isMine": false,
            "isRevealed": false,
            "isFlagged": false,
            "proximities": 1,
        },
        {
            "isMine": true,
            "isRevealed": false,
            "isFlagged": false,
            "proximities": 0,
        },
    ],
];

const testSettings = {
    [constants.Difficulties.EASY]: {
        flags: 5,
        minMines: 1,
        maxMines: 100,
        size: 2,
    },
    [constants.Difficulties.HARD]: {
        flags: 40,
        minMines: 1,
        maxMines: 7,
        size: 20,
    },
    [constants.Difficulties.EXTREME]: {
        flags: 100,
        minMines: 1,
        maxMines: 4,
        size: 30,
    },
};

jest.spyOn(GridAPI, "createGridWithProximites").mockReturnValue(testData);

describe("<Game />", () => {
    afterEach(() => {
        cleanup();
    });

    const defaultProps = {
        defaultDifficulty: constants.Difficulties.EASY,
        difficultySettings: testSettings,
        defaultTheme: themes.main,
        gameOverTheme: themes.gameover,
        gameWonTheme: themes.won,
    }

    test("expect the correct number of tiles on the board", async () => {
        render(
            <Game
                {...defaultProps}
            />,
        );

        const tiles = screen.getAllByTestId(tileTestID);
        expect(tiles.length).toBe(4);
    });

    test("expect the timer to stop/start/show the correct information.", async () => {
        const user = userEvent.setup();
        const {getAllByTestId, getByTestId} = render(
            <Game
                {...defaultProps}
            />,
        );

        await user.click(getAllByTestId(tileTestID)[0]);

        await waitFor(() => {
            expect(getByTestId(`${headerTestID}-timer`).innerHTML).not.toBe("0");
        }, {
            timeout: 2600,
        });

        await user.click(getByTestId(`${headerTestID}-reset-button`));
        await waitFor(() => {
            expect(getByTestId(`${headerTestID}-timer`).innerHTML).toBe("0");
        });
    });


    test("expect reset button to reset grid", async () => {
        const user = userEvent.setup();
        const {getAllByTestId, getByTestId} = render(
            <Game
                {...defaultProps}
            />,
        );

        await user.click(getAllByTestId(tileTestID)[0]);

        await waitFor(() => {
            expect(getByTestId(`${tileTestID}-proximity-number`)).toBeInTheDocument();
            expect(getAllByTestId(`${tileTestID}-proximity-number`).length).toBe(1);
            expect(getAllByTestId(`${tileTestID}-covered`).length).toBe(3);
        });

        await user.click(getByTestId(`${headerTestID}-reset-button`));
        await waitFor(() => {
            expect(getAllByTestId(`${tileTestID}-covered`).length).toBe(4);
        });
    });

    test("expect timer and game to stop when gameover condition is met", async () => {
        const user = userEvent.setup();
        const {getAllByTestId, getByTestId, container} = render(
            <Game
                {...defaultProps}
            />,
        );

        await user.click(getAllByTestId(tileTestID)[3]);

        await waitFor(() => {
            expect(getByTestId(`${tileTestID}-revealed-mine`)).toBeInTheDocument();
            expect(getAllByTestId(`${tileTestID}-covered`).length).toBe(3);
            expect(getByTestId(`${headerTestID}-timer`).innerHTML).toBe("0");
            expect(container.querySelector(".Header__action--gameover")).toBeInTheDocument();
        }, {
            timeout: 2100, // Long enough where the timer could be "2" but should be "0"
        });

        // It shouldn't uncover any more tiles.
        await user.click(getAllByTestId(tileTestID)[1]);
        await waitFor(() => {
            expect(getAllByTestId(`${tileTestID}-covered`).length).toBe(3);
        });
    });

    test("expect timer and game to stop when gamewon condition is met", async () => {
        const user = userEvent.setup();
        const {getAllByTestId, getByTestId, container, debug} = render(
            <Game
                {...defaultProps}
            />,
        );

        await user.click(getAllByTestId(tileTestID)[0]);
        await user.click(getAllByTestId(tileTestID)[1]);
        await user.click(getAllByTestId(tileTestID)[2]);

        await waitFor(() => {
            expect(getAllByTestId(`${tileTestID}-proximity-number`).length).toBe(3);
            expect(container.querySelector(".Header__action--gamewon")).toBeInTheDocument();
        });

        // It shouldn't uncover any more tiles.
        await user.click(getAllByTestId(tileTestID)[3]);
        await waitFor(() => {
            expect(getAllByTestId(`${tileTestID}-proximity-number`).length).toBe(3);
        });
    });

    test("expect flags to update when tile is right clicked", async () => {
        const user = userEvent.setup();
        const {getAllByTestId, getByTestId, container, debug} = render(
            <Game
                {...defaultProps}
            />,
        );

        await user.pointer({keys: "[MouseRight]", target: getAllByTestId(tileTestID)[0]});
        expect(getByTestId(`${headerTestID}-flags`).innerHTML)
            .toBe(`${testSettings[constants.Difficulties.EASY].flags - 1}`);

        // Expect it to reset when same tile is clicked again.
        await user.pointer({keys: "[MouseRight]", target: getAllByTestId(tileTestID)[0]});
        expect(getByTestId(`${headerTestID}-flags`).innerHTML)
            .toBe(`${testSettings[constants.Difficulties.EASY].flags}`);
    });

    test("expect board to reset when new settings are updated", async () => {
        const user = userEvent.setup();
        const {getAllByTestId, getByTestId, container, debug} = render(
            <Game
                {...defaultProps}
            />,
        );

        await user.click(getAllByTestId(tileTestID)[0]);
        await user.click(getAllByTestId(tileTestID)[1]);
        await user.click(getAllByTestId(tileTestID)[2]);

        await user.click(getByTestId(`${diffButtonTestID}-${constants.Difficulties.HARD.description}`));

        await waitFor(() => {
            expect(getAllByTestId(`${tileTestID}-covered`).length).toBe(4);
            expect(getByTestId(`${headerTestID}-flags`).innerHTML)
                .toBe(`${testSettings[constants.Difficulties.HARD].flags}`);
        }, {
            timeout: 2100, // Long enough for timer to update twice still running.
        });
    });
});
