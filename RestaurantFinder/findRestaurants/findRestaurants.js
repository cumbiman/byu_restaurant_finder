/**
 * Parses a static JSON file into a more useable object format.
 */

const restaurantJSON = require("../data/rest_hours.json");
const dateUtils = require("../dateTools/dateTools");
const timeUtils = require("../timeTools/timeTools");

const findRestaurants = (context, inputDate, inputTime) => {
    try {
        // Get the day of week for the user's inputted date
        const userDay = dateUtils.getUserDay(inputDate);
        // Get a converted floating point number representation of the user's inputted time
        const userTime = timeUtils.convertTimeToNumber(inputTime);

        const eligibleRestaurants = [];

        // Iterate through the array of restaurants and parse their open days and opening and closing times
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

        // If parse was successful return 200 status and array of names of eligible restaurants
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
            // If invalid date then return 400 error
            return {
                status: 400,
                headers: {
                    "Content-Type": "text/plain"
                },
                body: `The date "${inputDate}" is not a valid date. Please enter the date as YYYY-MM-DD`
            };
        } else if (err.message === "Invalid Time") {
            // If invalid time then return 400 error
            return {
                status: 400,
                headers: {
                    "Content-Type": "text/plain"
                },
                body: `The time "${inputTime}" is not a valid time. Please enter the time as HH:MM am/pm`
            };
        }

        // All other errors return 500 error
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
 * Takes the days portion of the times string and returns an array of all of the open days and their open and close times
 * (ie - Mon-Wed 11 am - 3:30 pm would return { openTime: 11, closeTime: 15.5, openDays:["mon", "tue", "wed"] })
 * @param {string} daySpan The day or span of days to parse
 * @returns An array of all days between the start and end day
 */
const getOpenDaysAndTimes = (times) => {
    const allResults = [];

    // Loop through the open times
    times.forEach((dayAndTime) => {
        // Get the open and close times
        const [openTime, closeTime] = timeUtils.parseTime(dayAndTime);

        // If the closing time is smaller than the opening time then we must have passed midnight
        const isOpenAfterMidnight = closeTime < openTime && closeTime !== 0;

        // Split apart any days of week separated by a comma
        const daySplit = dayAndTime.split(",");

        // Array to store the open days
        let openDays = [];

        // Loop through days and record all of the available days and open times
        daySplit.forEach((day) => {
            openDays = [...dateUtils.parseDate(day, false), ...openDays];
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
                pastMidnightOpenDays = [...dateUtils.parseDate(day, true)];
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

module.exports = findRestaurants;
