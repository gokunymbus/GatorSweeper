/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 *
 */

import React from "react";
import DifficultyButtons from "./DifficultyButtons";
import {Difficulties} from "../library/Constants";

import {render, cleanup, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const testData = [
    {
        string: "Test1",
        difficulty: Difficulties.EASY,
        ariaLabel: "TestARIA1",
        isActive: false,
    },
    {
        string: "Test2",
        difficulty: Difficulties.HARD,
        ariaLabel: "TestARIA2",
        isActive: true,
    },
    {
        string: "Test3",
        difficulty: Difficulties.EXTREME,
        ariaLabel: "TestARIA3",
        isActive: false,
    },
];

const buttonClassName = "DifficultyButtons__button";
const buttonClassNameSelector = "." + buttonClassName;

describe("<DifficultyButtons />", () => {
    afterEach(() => {
        cleanup();
    });

    test("render the appropriate buttons provided", () => {
        render(<DifficultyButtons
            buttons={testData}
            onButtonSelected={() => {}}
        />);

        expect(screen.getByText(testData[0].string)).toBeInTheDocument();
        expect(screen.getByText(testData[1].string)).toBeInTheDocument();
        expect(screen.getByText(testData[2].string)).toBeInTheDocument();
    });


    test("onButtonSelected is called when clicked and with difficulty level", async () => {
        const user = userEvent.setup()
        const onButtonSelected = jest.fn();
        const {container} = render(<DifficultyButtons
            buttons={testData}
            onButtonSelected={onButtonSelected}
        />);

        const elements = container.querySelectorAll(buttonClassNameSelector);
        await user.click(elements[0]);
        expect(onButtonSelected).toBeCalledWith(Difficulties.EASY);

        await user.click(elements[1]);
        expect(onButtonSelected).toBeCalledWith(Difficulties.HARD);

        await user.click(elements[2]);
        expect(onButtonSelected).toBeCalledWith(Difficulties.EXTREME);
    });

    test("onButtonSelected is called when enter key is pressed", async () => {
        const user = userEvent.setup()
        const onButtonSelected = jest.fn();
        const {container} = render(<DifficultyButtons
            buttons={testData}
            onButtonSelected={onButtonSelected}
        />);

        const elements = container.querySelectorAll(buttonClassNameSelector);
        elements[0].focus();
        await user.keyboard("[Enter]");
        expect(onButtonSelected).toBeCalledWith(Difficulties.EASY);

        elements[1].focus();
        await user.keyboard("[Enter]");
        expect(onButtonSelected).toBeCalledWith(Difficulties.HARD);

        elements[2].focus();
        await user.keyboard("[Enter]");
        expect(onButtonSelected).toBeCalledWith(Difficulties.EXTREME);
    });

    test("sets active button correctly", () => {
        const {container, rerender} = render(<DifficultyButtons
            buttons={testData}
            onButtonSelected={() => {}}
            activeDifficulty={Difficulties.HARD}
        />);

        const elements = container.querySelectorAll(buttonClassNameSelector);
        expect(elements[0].classList.contains(buttonClassName + "--active")).toBe(false);
        expect(elements[1].classList.contains(buttonClassName + "--active")).toBe(true);
        expect(elements[2].classList.contains(buttonClassName + "--active")).toBe(false);

        const testDataTwo = [
            {
                string: "Test1",
                difficulty: Difficulties.EASY,
                ariaLabel: "TestARIA1",
                isActive: false,
            },
            {
                string: "Test2",
                difficulty: Difficulties.HARD,
                ariaLabel: "TestARIA2",
                isActive: false,
            },
            {
                string: "Test3",
                difficulty: Difficulties.EXTREME,
                ariaLabel: "TestARIA3",
                isActive: true,
            },
        ];

        rerender(<DifficultyButtons
            buttons={testDataTwo}
            onButtonSelected={() => {}}
            activeDifficulty={Difficulties.EXTREME}
        />)

        const elementsRerender = container.querySelectorAll(buttonClassNameSelector);
        expect(elementsRerender[0].classList.contains(buttonClassName + "--active")).toBe(false);
        expect(elementsRerender[1].classList.contains(buttonClassName + "--active")).toBe(false);
        expect(elementsRerender[2].classList.contains(buttonClassName + "--active")).toBe(true);
    });
});
