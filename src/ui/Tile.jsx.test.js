import React from "react";
import Tile from "./Tile";
import { Difficulties, setFlagKey, selectTileKey } from "../library/Constants";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'

describe('<Tile />', () => {
    const defaultTileProps = {
        row: 0,
        column: 0,
        difficulty: Difficulties.EASY,
        onTileSelected: jest.fn(),
        onTileRightClicked: jest.fn(),
        onEnteryKeyUp: jest.fn(),
        onLongPress: jest.fn()
    }

    afterEach(() => {
        cleanup();
    });

    test('default render', () => {
        const { container } = render(
            <Tile
               {...defaultTileProps}
            />
        );

        expect(container.querySelector('.Tile__covered')).toBeInTheDocument();
    });

    test('renders a flag', () => {
        const { container } = render(
            <Tile
                row={0}
                {...defaultTileProps}
                isFlagged={true}
            />
        );
        expect(container.querySelector('.Tile__covered__flag')).toBeInTheDocument();
    });

    test('renders a mine when revealed and ismine', () => {
        const { container } = render(
            <Tile
                {...defaultTileProps}
                isMine={true}
                isRevealed={true}
            />
        );

        expect(container.querySelector('.Tile__revealed--mine')).toBeInTheDocument();
    });

    test('renders blank when revealed and ismine is false', () => {
        const { container } = render(
            <Tile
                {...defaultTileProps}
                isMine={false}
                isRevealed={true}
            />
        );

        expect(container.querySelector('.Tile__revealed--blank')).toBeInTheDocument();
    });

    test('renders proximities when revealed and provided', () => {
        const proximities = 5;
        const { container, getByText } = render(
            <Tile
                {...defaultTileProps}
                isMine={false}
                isRevealed={true}
                proximities={proximities}
            />
        );
        const proximityElement = container.querySelector('.Tile__revealed__proximityNumber');
        expect(proximityElement).toBeInTheDocument();
        expect(getByText(proximities)).toBeInTheDocument();
    });

    test('calls onTileSelected handler when clicked', async () => {
        const user = userEvent.setup()
        const onTileSelected = jest.fn();
        const { container } = render(
            <Tile
                {...defaultTileProps}
                onTileSelected={onTileSelected}
            />
        );

        await user.click(container.querySelector('.Tile'));
        expect(onTileSelected).toBeCalled();
    });

    test('calls onTileRightClicked event handler when right clicked', async () => {
        const user = userEvent.setup()
        const onTileRightClicked = jest.fn();
        const { container } = render(
            <Tile
                {...defaultTileProps}
                onTileRightClicked={onTileRightClicked}
            />
        );

        await user.pointer({keys: '[MouseRight]', target: container.querySelector('.Tile')});
        expect(onTileRightClicked).toBeCalled();
        
    });

    test('calls onEnterKeyUp event handler when enter key pressed', async () => {
        const user = userEvent.setup();
        const onEnterKeyUp = jest.fn();
        const onTileRightClicked = jest.fn();
        const { container } = render(
            <Tile
                {...defaultTileProps}
                onEnterKeyUp={onEnterKeyUp}
                onTileRightClicked={onTileRightClicked}
            />
        );

        const tileElement = container.querySelector('.Tile');
        tileElement.focus();
    
        await user.keyboard(`[${selectTileKey}]`);
        expect(onEnterKeyUp).toBeCalled();

        tileElement.focus();

        await user.keyboard(setFlagKey);
        expect(onTileRightClicked).toBeCalled();
    });


    test('calls onTileSelected event handler when tapped with finger', () => {
        const onTileSelected = jest.fn();
        const { container } = render(
            <Tile
                {...defaultTileProps}
                onTileSelected={onTileSelected}
            />
        );

        fireEvent.touchStart(container.querySelector('.Tile'), {});
        fireEvent.touchEnd(container.querySelector('.Tile'), {});
        expect(onTileSelected).toBeCalled();
    });

    test('calls onLongPress event handler when finger tap is held.', async () => {
        const onLongPress = jest.fn();
        const { container } = render(
            <Tile
                {...defaultTileProps}
                onLongPress={onLongPress}
            />
        );

        fireEvent.touchStart(container.querySelector('.Tile'), {});
        await new Promise(resolve => setTimeout(resolve, 2000));
        fireEvent.touchEnd(container.querySelector('.Tile'), {});

        expect(onLongPress).toBeCalled();
    });

});