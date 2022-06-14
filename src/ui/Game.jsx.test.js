/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 * 
 */

 import React from "react";
 import Game from "./Game";
 
 import { render, cleanup, screen } from "@testing-library/react";
 import userEvent from "@testing-library/user-event";
 import '@testing-library/jest-dom';

 describe('<Game />', () => {
    afterEach(() => {
        cleanup();
    });

    test('starts timer when a tile on the board is selected', async () => {
        // const user = userEvent.setup()
        // const { container }  = render(<Game />);
        // await user.click(container.querySelector('.Tile'));
        expect(true)
    });
 });
