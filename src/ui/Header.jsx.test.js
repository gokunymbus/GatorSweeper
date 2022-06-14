/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 * 
 */

 import React from "react";
 import Header from "./Header";
 
 import { render, cleanup, screen } from "@testing-library/react";
 import userEvent from "@testing-library/user-event";
 import '@testing-library/jest-dom';

 const defaultProps = {
     flags: 1,
     timer: 2,
     isGameWon: false,
     isGameOver: false,
     statusName: "Status1",
     statusAriaDescription: "StatusAria1",
     onReset: () => {}
 }

 describe('<Header />', () => {
    afterEach(() => {
        cleanup();
    });

    test('flags, timer and status render correctly', () => {
        render(<Header
            {...defaultProps}
        />);
        expect(screen.getByText(defaultProps.flags)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.timer)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.statusName)).toBeInTheDocument();
    });

    test('onReset is called correctly when clicked with a mouse', async () => {
        const user = userEvent.setup();
        const onReset = jest.fn();
        const { container } = render(<Header
            {...defaultProps}
            onReset={onReset}
        />);

        await user.click(container.querySelector('.Header__action'));
        expect(onReset).toBeCalled();
    });

    test('onReset is called correctly when focused and enter key is pressed', async () => {
        const user = userEvent.setup();
        const onReset = jest.fn();
        const { container } = render(<Header
            {...defaultProps}
            onReset={onReset}
        />);
        const element = container.querySelector('.Header__action');
        element.focus();
        await user.keyboard("[Enter]");
        expect(onReset).toBeCalled();
    });
 });
