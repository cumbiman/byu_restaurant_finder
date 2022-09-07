const jsonParser = require("./jsonParser");
const context = require("../../testing/defaultContext");

test("JsonParser should return 400 and write to log if invalid date is entered", async () => {
    const inputDate = "asdfasdfasd";
    const inputTime = "12:30 pm";

    const jsonParserResults = jsonParser(context, inputDate, inputTime);

    expect(jsonParserResults.body).toEqual(
        `The date "${inputDate}" is not a valid date. Please enter the date as YYYY-MM-DD`
    );

    expect(jsonParserResults.status).toEqual(400);

    expect(context.log.mock.lastCall).toEqual([
        "JSONparser error: ",
        "Invalid Date"
    ]);
});

test("JsonParser should return 400 and write to log if invalid time is entered", async () => {
    const inputDate = "2000-01-01";
    const inputTime = "55:96 pm";

    const jsonParserResults = jsonParser(context, inputDate, inputTime);

    expect(jsonParserResults.body).toEqual(
        `The time "${inputTime}" is not a valid time. Please enter the time as HH:MM am/pm`
    );

    expect(jsonParserResults.status).toEqual(400);

    expect(context.log.mock.lastCall).toEqual([
        "JSONparser error: ",
        "Invalid Time"
    ]);
});

test("JsonParser should return 400 and write to log if invalid time 25:20 is entered", async () => {
    const inputDate = "2000-01-01";
    const inputTime = "25:20 pm";

    const jsonParserResults = jsonParser(context, inputDate, inputTime);

    expect(jsonParserResults.body).toEqual(
        `The time "${inputTime}" is not a valid time. Please enter the time as HH:MM am/pm`
    );

    expect(jsonParserResults.status).toEqual(400);

    expect(context.log.mock.lastCall).toEqual([
        "JSONparser error: ",
        "Invalid Time"
    ]);
});

test("Should return list of restaurants", () => {
    const jsonParserResults = jsonParser(context, "2022-01-01", "12:00 pm");

    expect(jsonParserResults.body.restaurants.length).toEqual(44);

    expect(jsonParserResults.status).toEqual(200);

    expect(jsonParserResults.headers["Content-Type"]).toEqual(
        "application/json"
    );
});

test("Should return list of restaurants open at midnight", () => {
    const jsonParserResults = jsonParser(context, "2022-01-01", "0");

    expect(jsonParserResults.body.restaurants.length).toEqual(10);

    expect(jsonParserResults.status).toEqual(200);

    expect(jsonParserResults.headers["Content-Type"]).toEqual(
        "application/json"
    );
});

// test("Convert 12:34:56 to number", () => {
//     expect(jsonParser.convertTimeToNumber("12:34:56")).toEqual(12.57);
// });
