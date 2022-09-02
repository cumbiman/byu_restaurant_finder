const jsonParser = require('./jsonParser');

test("Should import JSON file", () => {
    expect(jsonParser().length).toBeGreaterThan(0);
});