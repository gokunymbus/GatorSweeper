/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 *
 */

import React from "react";
import Tile, {testID} from "./Tile";
import {Difficulties, setFlagKey, selectTileKey} from "../library/Constants";
import {render, cleanup, fireEvent, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"

describe("<Tile />", () => {
    const defaultTileProps = {
        row: 0,
        column: 0,
        difficulty: Difficulties.EASY,
        onTileSelected: jest.fn(),
        onTileRightClicked: jest.fn(),
        onEnteryKeyUp: jest.fn(),
        onLongPress: jest.fn(),
    }

    afterEach(() => {
        cleanup();
    });

    test("default render", () => {
        render(
            <Tile
                {...defaultTileProps}
            />,
        );

        expect(screen.getByTestId(`${testID}-covered`)).toBeInTheDocument();
    });

    test("renders a flag", () => {
        render(
            <Tile
                row={0}
                {...defaultTileProps}
                isFlagged={true}
            />,
        );
        expect(screen.getByTestId(`${testID}-covered-flag`)).toBeInTheDocument();
    });

    test("renders a mine when revealed and ismine", () => {
        render(
            <Tile
                {...defaultTileProps}
                isMine={true}
                isRevealed={true}
            />,
        );

        expect(screen.getByTestId(`${testID}-revealed-mine`)).toBeInTheDocument();
    });

    test("renders blank when revealed and ismine is false", () => {
        render(
            <Tile
                {...defaultTileProps}
                isMine={false}
                isRevealed={true}
            />,
        );

        expect(screen.getByTestId(`${testID}-revealed-blank`)).toBeInTheDocument();
    });

    test("renders proximities when revealed and provided", () => {
        const proximities = 5;
        const {getByText} = render(
            <Tile
                {...defaultTileProps}
                isMine={false}
                isRevealed={true}
                proximities={proximities}
            />,
        );
        expect(screen.getByTestId(`${testID}-proximity-number`)).toBeInTheDocument();
        expect(getByText(proximities)).toBeInTheDocument();
    });

    test("calls onTileSelected handler when clicked", async () => {
        const user = userEvent.setup();
        const onTileSelected = jest.fn();
        render(
            <Tile
                {...defaultTileProps}
                onTileSelected={onTileSelected}
            />,
        );

        await user.click(screen.getByTestId(`${testID}`));
        expect(onTileSelected).toBeCalled();
    });

    test("calls onSetFlag event handler when right clicked", async () => {
        const user = userEvent.setup();
        const onSetFlag = jest.fn();
        render(
            <Tile
                {...defaultTileProps}
                onSetFlag={onSetFlag}
            />,
        );

        await user.pointer({keys: "[MouseRight]", target: screen.getByTestId(`${testID}`)});
        expect(onSetFlag).toBeCalled();
    });

    test("calls onTileSelected event handler when enter key pressed", async () => {
        const user = userEvent.setup();
        const onTileSelected = jest.fn();
        render(
            <Tile
                {...defaultTileProps}
                onTileSelected={onTileSelected}
            />,
        );

        const tileElement = screen.getByTestId(`${testID}`);
        tileElement.focus();

        await user.keyboard(`[${selectTileKey}]`);
        expect(onTileSelected).toBeCalled();
    });

    test("calls onSetFlag event handler when setFlagKey is pressed", async () => {
        const user = userEvent.setup();
        const onSetFlag = jest.fn();
        render(
            <Tile
                {...defaultTileProps}
                onSetFlag={onSetFlag}
            />,
        );

        const tileElement = screen.getByTestId(`${testID}`);
        tileElement.focus();

        await user.keyboard(`${setFlagKey}`);
        expect(onSetFlag).toBeCalled();
    });


    test("calls onTileSelected event handler when tapped with finger", () => {
        const onTileSelected = jest.fn();
        render(
            <Tile
                {...defaultTileProps}
                onTileSelected={onTileSelected}
            />,
        );

        fireEvent.touchStart(screen.getByTestId(`${testID}`), {});
        fireEvent.touchEnd(screen.getByTestId(`${testID}`), {});
        expect(onTileSelected).toBeCalled();
    });

    test("calls onSetFlag event handler when finger tap is held.", async () => {
        const onSetFlag = jest.fn();
        render(
            <Tile
                {...defaultTileProps}
                onSetFlag={onSetFlag}
            />,
        );

        fireEvent.touchStart(screen.getByTestId(`${testID}`), {});
        await new Promise((resolve) => setTimeout(resolve, 2000));
        fireEvent.touchEnd(screen.getByTestId(`${testID}`), {});

        expect(onSetFlag).toBeCalled();
    });
});
