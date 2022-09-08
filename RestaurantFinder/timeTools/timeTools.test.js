const timeUtils = require("./timeTools");

test("parseTime should return error if time is invalid", async () => {
    const badTime = "invalid time";

    expect(() => {
        timeUtils.parseTime(badTime);
    }).toThrow(`Bailed on ${badTime}. No valid time span found.`);
});

test("parseTime should return array of floating point numbers", async () => {
    const timeSpan = "11 am - 8:45 pm";

    const [openTime, closeTime] = timeUtils.parseTime(timeSpan);

    // Test opening time
    expect(openTime).toBeCloseTo(11);

    // Test closing time
    expect(closeTime).toBeCloseTo(20.75);
});

test("convertTimeToNumber should return error if time is invalid", async () => {
    const badTime = "someInvalidTime";

    expect(() => {
        timeUtils.convertTimeToNumber(badTime);
    }).toThrow("Invalid Time");
});

test("convertTimeToNumber should return correct values for a variety of numbers", async () => {
    const midnight = timeUtils.convertTimeToNumber("12:00 am");
    expect(midnight).toBeCloseTo(24);

    const afterMidnight = timeUtils.convertTimeToNumber("12:59 am");
    expect(afterMidnight).toBeCloseTo(0.98);

    const noon = timeUtils.convertTimeToNumber("12 pm");
    expect(noon).toBeCloseTo(12);

    const afternoon = timeUtils.convertTimeToNumber("11:59 pm");
    expect(afternoon).toBeCloseTo(23.98);

    const twentyFourHours = timeUtils.convertTimeToNumber("23:25");
    expect(twentyFourHours).toBeCloseTo(23.42);

    const zero = timeUtils.convertTimeToNumber("0:13");
    expect(zero).toBeCloseTo(0.22);
});
