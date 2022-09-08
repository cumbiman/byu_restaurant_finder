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
    if (!daySpanMatches || daySpanMatches.length < 2)
        throw new Error(`Bailed on ${days}`);

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

module.exports = { getUserDay, parseDate };
