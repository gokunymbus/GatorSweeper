import replaceStringTokens from "./replaceStringTokens";

describe("replaceStringTokens", () => {
    test("replaces single value", () => {
        const testString = "Yay i have {0} of these things!";
        const replacedString = replaceStringTokens(testString, [500]);
        const finalString = "Yay i have 500 of these things!"
        expect(replacedString).toEqual(finalString);
    })

    test("replaces multiple values", () => {
        const testString = "Yay i have {0} of these things and {1} of these!";
        const replacedString = replaceStringTokens(testString, [1, 100000]);
        const finalString = "Yay i have 1 of these things and 100000 of these!"
        expect(replacedString).toEqual(finalString);
    })

    test("returns original string and no error if arrayOfValues is not an array ", () => {
        const testString = "Yay i have {0} of these things and {1} of these!";
        const replacedString = replaceStringTokens(testString, {});
        expect(replacedString).toEqual(testString);
    })

    test("replaces multiple values correctly even if more array values than string tokens are provided.", () => {
        const testString = "Yay i have {0} of these things and {1} of these!";
        const replacedString = replaceStringTokens(testString, [1, 100000, 5000]);
        const finalString = "Yay i have 1 of these things and 100000 of these!"
        expect(replacedString).toEqual(finalString);
    })

    test("replaces multiple values correctly even string is empty and values are provided", () => {
        const testString = "";
        const replacedString = replaceStringTokens(testString, [1, 100000, 5000]);
        expect(replacedString).toEqual(testString);
    })
});
