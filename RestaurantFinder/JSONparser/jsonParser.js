/**
 * Parses a static JSON file into a more useable object format.
 */

const restaurantJSON = require("../data/rest_hours.json");

const jsonParser = (context, inputDate, inputTime) => {
    try {
        const userDay = getUserDay(inputDate);
        const userTime = convertTimeToNumber(inputTime);

        const eligibleRestaurants = [];

        restaurantJSON.forEach((restaurant) => {
            const openTimes = getOpenDaysAndTimes(restaurant.times);

            const restaurantsOpenOnDay = openTimes.find((hours) => {
                const isOpen =
                    hours.openDays.includes(userDay) &&
                    hours.openTime <= userTime &&
                    hours.closeTime >= userTime;

                return isOpen;
            });

            if (restaurantsOpenOnDay) {
                eligibleRestaurants.push(restaurant.name);
            }
        });

        return {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                restaurants: eligibleRestaurants
            }
        };
    } catch (err) {
        context.log("JSONparser error: ", err.message ?? err);

        if (err.message === "Invalid Date") {
            return {
                status: 400,
                headers: {
                    "Content-Type": "text/plain"
                },
                body: `The date "${inputDate}" is not a valid date. Please enter the date as YYYY-MM-DD`
            };
        } else if (err.message === "Invalid Time") {
            return {
                status: 400,
                headers: {
                    "Content-Type": "text/plain"
                },
                body: `The time "${inputTime}" is not a valid time. Please enter the time as HH:MM am/pm`
            };
        }

        return {
            status: 500,
            headers: {
                "Content-Type": "text/plain"
            },
            body: "There was an error retrieving restaurant times. Please contact customer support for assistance."
        };
    }
};

/**
 * Gets the day of the week from the user's inputted date.
 * @param {string} inputDate The date as a string
 * @returns The day of the week
 */
const getUserDay = (inputDate) => {
    const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const userDate = new Date(inputDate);
    const foundDay = dayOfWeek[userDate.getDay()];

    if (userDate == "Invalid Date" || foundDay === undefined)
        throw new Error("Invalid Date");

    return foundDay;
};

/**
 * Takes the days portion of the times string and returns all of the open days
 * (ie - Mon-Wed would return `["Mon", "Tue", "Wed"])
 * @param {string} daySpan The day or span of days to parse
 * @returns An array of all days between the start and end day
 */
const getOpenDaysAndTimes = (times) => {
    const allResults = [];

    // Loop through the open times
    times.forEach((dayAndTime) => {
        // Get the open and close times
        const [openTime, closeTime] = parseTime(dayAndTime);

        // If the closing time is smaller than the opening time then we must have passed midnight
        const isOpenAfterMidnight = closeTime < openTime && closeTime !== 0;

        // Split apart any days of week separated by a comma
        const daySplit = dayAndTime.split(",");

        // Array to store the open days
        let openDays = [];

        // Loop through days and record all of the available days and open times
        daySplit.forEach((day) => {
            openDays = [...parseDate(day, false), ...openDays];
        });

        // Compile results (if close time on or after midnight then make the closing time 24)
        allResults.push({
            openTime: openTime,
            closeTime: !isOpenAfterMidnight && closeTime !== 0 ? closeTime : 24,
            openDays: openDays
        });

        // If the restaurant is open after midnight then calculate the days and open times for the next morning
        if (isOpenAfterMidnight) {
            let pastMidnightOpenDays = [];

            daySplit.forEach((day) => {
                pastMidnightOpenDays = [...parseDate(day, true)];
            });

            allResults.push({
                openTime: 0,
                closeTime: closeTime,
                openDays: pastMidnightOpenDays
            });
        }
    });

    return allResults;
};

/**
 * Parses the JSON open and close times and returns the times as numbers.
 * @param {string} dayAndTime The day of the week and times of day when a restaurant is open
 * @returns The opening and closing times for the restaurant
 */
const parseTime = (dayAndTime) => {
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
};

/**
 * Function to pull apart the time string and return a more useable number.
 * @param {string} time The time as a string, either in format HH:MM or HH:MM AM/PM
 * @returns The time formatted as a number HH.(MM/60)
 */
const convertTimeToNumber = (time) => {
    // Make sure we have a valid date
    if (
        !/^[0-2]{0,1}[0-9](?:\:[0-5][0-9]){0,2}\s*(?:am|pm){0,1}$/gi.test(
            time.trim()
        )
    )
        throw new Error("Invalid Time");

    // Split up the time string into hours and minutes
    const timeSections = time.replace(/am|pm/gi, "").trim().split(":");

    // Make sure the time isn't more than 24 hours or 59 minutes
    if (
        timeSections[0] > 24 ||
        (timeSections.length > 1 && timeSections[1] > 59)
    )
        throw new Error("Invalid Time");

    // Get the minutes and convert them into a floating number
    const minutes =
        timeSections.length > 1 && !isNaN(timeSections[1])
            ? Math.round(timeSections[1].trim() / 60, 2)
            : 0;

    // Get the hours and convert them to an integer
    let hours;
    if (/12(:00){0,2}\s*am/gi.test(time)) {
        // If 12 AM then set hours to 24
        hours = 24;
    } else if (/12(:\d{1,2}){1,2}\s*am/gi.test(time)) {
        // If 12:01 AM to 12:59 AM then set hours to 0
        hours = 0;
    } else if (/12(:\d{1,2}){0,2}\s*pm/gi.test(time)) {
        // If 12 PM then set hours to 12
        hours = 12;
    } else if (/pm/gi.test(time)) {
        // If afternoon then convert to 24 hour time
        hours = parseInt(timeSections[0].trim()) + 12;
    } else {
        // If AM or unspecified then just keep the hours as provided
        hours = parseInt(timeSections[0].trim());

        // If hours is 0 (exactly midnight) then set the hours to 24
        if (hours === 0) {
            hours = 24;
        }
    }

    return hours + minutes;
};

/**
 * Takes a day or range of days and returns an array of each day in the range.
 * @param {string} days A range of days (ie mon-thu) or a single day
 * @returns All of the open days as an array of strings
 */
const parseDate = (days, openPastMidnight) => {
    // Array of all possible days of the week
    const mondayToSunday = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

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
        const firstDay = mondayToSunday.findIndex(
            (dayOfWeek) =>
                dayArray[0].toLowerCase().trim() === dayOfWeek.toLowerCase()
        );
        const lastDay = mondayToSunday.findIndex(
            (dayOfWeek) =>
                dayArray[1].toLowerCase().trim() === dayOfWeek.toLowerCase()
        );

        let allIncludedDays = [];

        if (!openPastMidnight) {
            // Get all of the days between and inclusive of two days of the week
            allIncludedDays = mondayToSunday.slice(firstDay, lastDay + 1);
        } else {
            // If the open time for a day goes past midnight, then add the next day to the beginning and ending day
            const lastDayIndex =
                lastDay + 2 > mondayToSunday.length ? 0 : lastDay + 2;

            if (firstDay + 1 < lastDayIndex) {
                // Get all of the days between and inclusive of two days of the week
                allIncludedDays = mondayToSunday.slice(
                    firstDay + 1,
                    lastDayIndex
                );
            } else {
                // If the open days wrap around from Sun back to Mon then get the beginning and tail end of the array
                allIncludedDays = [
                    ...mondayToSunday.slice(0, lastDayIndex),
                    ...mondayToSunday.slice(lastDayIndex)
                ];
            }
        }

        // Save all of the open days as an array
        openDaysArray = [...allIncludedDays];
    } else {
        // Otherwise, process a single day
        const singleDay = daySpan.toLowerCase().trim();

        if (!openPastMidnight) {
            // Find the day of the week that matches the restaurant open day
            if (mondayToSunday.includes(singleDay)) {
                openDaysArray.push(singleDay);
            }
        } else {
            // If the restaurant is open past midnight then calculate the additional day/time
            const dayIndex = mondayToSunday.findIndex(
                (dayOfWeek) => singleDay === dayOfWeek.toLowerCase()
            );
            const pastMidnightDay =
                dayIndex + 1 >= mondayToSunday.length ? 0 : dayIndex + 1;
            openDaysArray.push(mondayToSunday[pastMidnightDay]);
        }
    }

    return openDaysArray;
};

module.exports = jsonParser;
