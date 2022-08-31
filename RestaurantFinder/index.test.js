const httpFunction = require("./index");
const context = require("../testing/defaultContext");

test("Http trigger should return a missing input response (no date or time)", async () => {
    const request = {};

    await httpFunction(context, request);

    expect(context.res.body).toEqual("Error retrieving restaurant open times. Please verify that you entered a correct date and time.");
});

test("Http trigger should return a missing input response (no date)", async () => {
    const request = {
        query: {
            time: "11:55:23"
        }
    };

    await httpFunction(context, request);

    expect(context.res.body).toEqual("Error retrieving restaurant open times. Please verify that you entered a correct date and time.");
});

test("Http trigger should return a response with a date and time", async () => {
    const request = {
        query: {
            date: "2022-08-15",
            time: "11:55:23"
        }
    };

    await httpFunction(context, request);

    expect(context.res.body).toEqual(
        `inputDate: ${request.query.date}; inputTime: ${request.query.time}`
    );
});
