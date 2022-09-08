const httpFunction = require("./index");
const context = require("../testing/defaultContext");

test("Http trigger should return a 400 error and a missing input response (no date or time)", async () => {
    const request = {};

    await httpFunction(context, request);

    expect(context.res.body).toEqual(
        "Error retrieving restaurant open times. Please verify that you entered a correct date and time."
    );

    expect(context.res.status).toEqual(400);
});

test("Http trigger should return a 400 error and a missing input response (no date)", async () => {
    const request = {
        query: {
            time: "11:55:23"
        }
    };

    await httpFunction(context, request);

    expect(context.res.body).toEqual(
        "Error retrieving restaurant open times. Please verify that you entered a correct date and time."
    );

    expect(context.log.mock.lastCall).toEqual([
        "Error: ",
        "Missing or invalid date or time inputs"
    ]);
});

test("Http trigger should return a 400 error and a missing input response (no time)", async () => {
    const request = {
        query: {
            date: "2000-01-01"
        }
    };

    await httpFunction(context, request);

    expect(context.res.body).toEqual(
        "Error retrieving restaurant open times. Please verify that you entered a correct date and time."
    );

    expect(context.log.mock.lastCall).toEqual([
        "Error: ",
        "Missing or invalid date or time inputs"
    ]);
});

test("Http trigger should return a status of 200 for 12 pm on 1 Jan 2000", async () => {
    const request = {
        query: {
            date: "2000-01-01",
            time: "12:00 pm"
        }
    };

    await httpFunction(context, request);

    expect(context.res.status).toEqual(200);
});

test("Http trigger should return a list of open restaurants for 15 Aug 2022 at 11:55:23", async () => {
    const request = {
        query: {
            date: "2022-08-15",
            time: "11:55:23"
        }
    };

    await httpFunction(context, request);

    // Make sure we get 48 restaurants back
    expect(context.res.body.restaurants.length).toEqual(48);

    // Make sure "Bombay Indian Restaurant" is one of the included results
    expect(
        context.res.body.restaurants.includes("Bombay Indian Restaurant")
    ).toBeTruthy();
});

test("Http trigger at 4 am should only return one restaurant: Naan 'N' Curry", async () => {
    const request = {
        query: {
            date: "2000-01-01",
            time: "4 am"
        }
    };

    await httpFunction(context, request);

    // Make sure we get 1 restaurant back
    expect(context.res.body.restaurants.length).toEqual(1);

    // Make sure the restaurant is "Naan 'N' Curry"
    expect(context.res.body.restaurants[0]).toEqual("Naan 'N' Curry");
});
