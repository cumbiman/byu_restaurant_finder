const dateUtils = require("./dateTools");

test("getUserDay should return error if date is invalid", async () => {
    expect(() => {
        dateUtils.getUserDay("2022-01-5000");
    }).toThrow("Invalid Date");
});

test("getUserDay should return day", async () => {
    const day = dateUtils.getUserDay("2000-01-01");

    expect(day).toEqual("sat");
});

test("parseDate should return error if date is invalid", async () => {
    const badDate = "2000-5555-asdf";

    expect(() => {
        dateUtils.parseDate(badDate);
    }).toThrow(`Bailed on ${badDate}`);
});

test("parseDate should return array from 'mon' to 'thu' for opening time `Mon-Thu 11 am - 10:30 pm`", async () => {
    const parsedDate = dateUtils.parseDate("Mon-Thu 11 am - 10:30 pm");

    expect(parsedDate).toEqual(["mon", "tue", "wed", "thu"]);
});

test("parseDate should return array from 'tue' to 'fri' for after midnight opening time `Mon-Thu 11 am - 12:30 pm`", async () => {
    const parsedDate = dateUtils.parseDate("Mon-Thu 11 am - 12:30 pm", true);

    expect(parsedDate).toEqual(["tue", "wed", "thu", "fri"]);
});

test("parseDate should return array of 'sun' for opening time `Sun 11 am - 10:30 pm`", async () => {
    const parsedDate = dateUtils.parseDate("Sun 11 am - 10:30 pm");

    expect(parsedDate).toEqual(["sun"]);
});

test("parseDate should return array of 'mon' for after midnight opening time `Sun 11 am - 12:30 pm`", async () => {
    const parsedDate = dateUtils.parseDate("Sun 11 am - 1:30 am", true);

    expect(parsedDate).toEqual(["mon"]);
});
