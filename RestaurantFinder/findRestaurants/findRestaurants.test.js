const findRestaurants = require("./findRestaurants");
const context = require("../../testing/defaultContext");

test("findRestaurants should return 400 and write to log if invalid date is entered", async () => {
    const inputDate = "asdfasdfasd";
    const inputTime = "12:30 pm";

    const findRestaurantsResults = findRestaurants(
        context,
        inputDate,
        inputTime
    );

    expect(findRestaurantsResults.body).toEqual(
        `The date "${inputDate}" is not a valid date. Please enter the date as YYYY-MM-DD`
    );

    expect(findRestaurantsResults.status).toEqual(400);

    expect(context.log.mock.lastCall).toEqual([
        "findRestaurants error: ",
        "Invalid Date"
    ]);
});

test("findRestaurants should return 400 and write to log if invalid time is entered", async () => {
    const inputDate = "2000-01-01";
    const inputTime = "55:96 pm";

    const findRestaurantsResults = findRestaurants(
        context,
        inputDate,
        inputTime
    );

    expect(findRestaurantsResults.body).toEqual(
        `The time "${inputTime}" is not a valid time. Please enter the time as HH:MM am/pm`
    );

    expect(findRestaurantsResults.status).toEqual(400);

    expect(context.log.mock.lastCall).toEqual([
        "findRestaurants error: ",
        "Invalid Time"
    ]);
});

test("findRestaurants should return 400 and write to log if invalid time 25:20 is entered", async () => {
    const inputDate = "2000-01-01";
    const inputTime = "25:20 pm";

    const findRestaurantsResults = findRestaurants(
        context,
        inputDate,
        inputTime
    );

    expect(findRestaurantsResults.body).toEqual(
        `The time "${inputTime}" is not a valid time. Please enter the time as HH:MM am/pm`
    );

    expect(findRestaurantsResults.status).toEqual(400);

    expect(context.log.mock.lastCall).toEqual([
        "findRestaurants error: ",
        "Invalid Time"
    ]);
});

test("Should return list of restaurants", () => {
    const findRestaurantsResults = findRestaurants(
        context,
        "2022-01-01",
        "12:00 pm"
    );

    expect(findRestaurantsResults.body.restaurants.length).toEqual(44);

    expect(findRestaurantsResults.status).toEqual(200);

    expect(findRestaurantsResults.headers["Content-Type"]).toEqual(
        "application/json"
    );
});

test("Should return list of restaurants open at midnight", () => {
    const findRestaurantsResults = findRestaurants(context, "2022-01-01", "0");

    expect(findRestaurantsResults.body.restaurants.length).toEqual(10);

    expect(findRestaurantsResults.status).toEqual(200);

    expect(findRestaurantsResults.headers["Content-Type"]).toEqual(
        "application/json"
    );
});
