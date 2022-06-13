import React from "react";
import Grid from "./Grid";

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

const testData = [
    [{name: "Row1 Column1"}, {name: "Row1 Column2"}],
    [{name: "Row2 Column1"}, {name: "Row2 Column2"}],
    [{name: "Row3 Column1"}, {name: "Row3 Column2"}]
];

describe('Grid.jsx', () => {
    afterEach(() => {
        cleanup();
    });

    test('properly renders 6 rows and columns of data', () => {
        render(
            <Grid
               gridData={testData}
               renderCell={(rowIndex, columnIndex, cellData) => {
                   return (
                       <div>
                           {cellData.name}
                       </div>
                   )
               }}
            />
        );

        expect(screen.getAllByText('Row', {exact: false}).length).toBe(6);
        expect(container.querySelectorAll('.Grid__column').length).toBe(6);
        expect(container.querySelectorAll('.Grid__row').length).toBe(3);
    });
});