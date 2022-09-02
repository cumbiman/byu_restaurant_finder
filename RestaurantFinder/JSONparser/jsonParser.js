/**
 * Parses a static JSON file into a more useable object format.
 */

const restaurantJSON = require("../data/rest_hours.json");

module.exports = (context) => {
    try {
        // Store the restaurants that are open for each day
        const parsedData = {
            mon: [],
            tue: [],
            wed: [],
            thu: [],
            fri: [],
            sat: [],
            sun: []
        };

        restaurantJSON.forEach((restaurant) => {
            const openTimes = getOpenDaysAndTimes(restaurant.times);

            const results = {
                name: restaurant.name,
                openTimes: openTimes
            };

            console.log(results);
        });
    } catch (err) {
        context.log("JSONparser error: ", err.message ?? err);

        return {
            status: 500,
            body: "There was an error retrieving restaurant times. Please contact customer support for assistance."
        };
    }
};

/**
 * Takes the days portion of the times string and returns all of the open days
 * (ie - Mon-Wed would return `["Mon", "Tue", "Wed"])
 * @param {string} daySpan The day or span of days to parse
 * @returns An array of all days between the start and end day
 */
function getOpenDaysAndTimes(times) {
    const allResults = [];

    // Loop through the open times
    times.forEach((dayAndTime) => {
        // Get the open and close times
        const [openTime, closeTime] = parseTime(dayAndTime);

        // Split apart any days of week separated by a comma
        const daySplit = dayAndTime.split(",");

        // Array to store the open days
        let openDays = [];

        // Loop through days and record all of the available days and open times
        daySplit.forEach((day) => {
            openDays = [...parseDate(day), ...openDays];
        });

        // Compile results
        const results = {
            openTime: openTime,
            closeTime: closeTime,
            openDays: openDays
        };

        allResults.push(results);
    });

    return allResults;
}

function parseTime(dayAndTime) {
    // Capture the time-span portion of the day/time string (expecting format
    // "Mon-Thu, Sun 10 am - 10:30 pm" or some variation of this)
    const timeSpanMatches = dayAndTime.match(/(\d+.*$)/);

    // If we didn't get a match on time then bail
    if (timeSpanMatches.length < 2)
        throw new Error(`Bailed on ${dayAndTime}. No valid time span found.`);

    // Split the open and close times
    const timeSpan = timeSpanMatches[1].split("-");

    const openTime = convertTimeToNumber(timeSpan[0]);
    const closeTime = convertTimeToNumber(timeSpan[1]);

    return [openTime, closeTime];
}

// Function to pull apart the time string and return a more useable number
function convertTimeToNumber(time) {
    // Get the minutes if any are specified
    const minutes = /:/.test(time) ? parseInt(time.match(/:(\d+)/)[1]) / 60 : 0;

    // Get the hours. If PM then convert to 24 hour format
    const hours = /am/gi.test(time)
        ? parseInt(time.replace("am", "").split(":")[0].trim())
        : parseInt(time.replace("pm", "").split(":")[0].trim()) + 12;

    return hours + minutes;
}

function parseDate(days) {
    // Array of all possible days of the week
    const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

    // Array to store the open days
    let openDaysArray = [];

    // Capture the day of week span in the day/time string
    const daySpanMatches = days.trim().match(/^([a-zA-Z-,]+)/);

    // If we don't find any matching days then bail
    if (daySpanMatches.length < 2) throw new Error(`Bailed on ${days}`);

    // Store the day span
    const daySpan = daySpanMatches[1];

    // If it's a range of days separated by a -
    if (/-/g.test(daySpan)) {
        // Get the first and last day
        const dayArray = daySpan.split("-");

        // Find the indexes of the first and last days in the daysOfWeek array
        const firstDay = daysOfWeek.findIndex(
            (dayOfWeek) =>
                dayArray[0].toLowerCase().trim() === dayOfWeek.toLowerCase()
        );
        const lastDay = daysOfWeek.findIndex(
            (dayOfWeek) =>
                dayArray[1].toLowerCase().trim() === dayOfWeek.toLowerCase()
        );

        const allIncludedDays = daysOfWeek.slice(firstDay, lastDay + 1);

        // Capture all of the included days as an array
        openDaysArray = [...openDaysArray, ...allIncludedDays];
    } else {
        // Otherwise, process a single day
        const singleDay = daySpan.toLowerCase().trim();
        if (daysOfWeek.includes(singleDay)) {
            openDaysArray.push(singleDay);
        }
    }

    return openDaysArray;
}
