/**
 * @Copyright John Miller
 * @Author John Miller
 * @License MIT GatorSweeper 2022
 *
 */

import React from "react";
import Grid, {testID} from "./Grid";

import {render, cleanup, screen} from "@testing-library/react";
import "@testing-library/jest-dom";

const testData = [
    [{name: "Row1 Column1"}, {name: "Row1 Column2"}],
    [{name: "Row2 Column1"}, {name: "Row2 Column2"}],
    [{name: "Row3 Column1"}, {name: "Row3 Column2"}],
];

describe("<Grid />", () => {
    afterEach(() => {
        cleanup();
    });

    test("properly renders 6 rows and columns of data", () => {
        const {container, getAllByTestId} = render(
            <Grid
                gridData={testData}
                renderCell={(rowIndex, columnIndex, cellData) => {
                    return (
                        <div>
                            {cellData.name}
                        </div>
                    )
                }}
            />,
        );

        expect(screen.getAllByText("Row", {exact: false}).length).toBe(6);
        expect(getAllByTestId(`${testID}-column`).length).toBe(6);
        expect(getAllByTestId(`${testID}-row`).length).toBe(3);
    });

    test("render cell calls with correct values", () => {
        const renderCell = jest.fn((rowIndex, columnIndex, cellData) => {
            return (
                <div></div>
            )
        });
        render(
            <Grid
                gridData={testData}
                renderCell={renderCell}
            />,
        );

        expect(renderCell).nthCalledWith(1, 0, 0, testData[0][0]);
        expect(renderCell).nthCalledWith(2, 0, 1, testData[0][1]);
        expect(renderCell).nthCalledWith(3, 1, 0, testData[1][0]);
        expect(renderCell).nthCalledWith(4, 1, 1, testData[1][1]);
        expect(renderCell).nthCalledWith(5, 2, 0, testData[2][0]);
        expect(renderCell).nthCalledWith(6, 2, 1, testData[2][1]);
    });
});
