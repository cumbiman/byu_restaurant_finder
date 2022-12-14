/**
 * Parses the JSON open and close times and returns the times as floating point numbers.
 * @param {string} dayAndTime The day of the week and times of day when a restaurant is open
 * @returns The opening and closing times for the restaurant as an array
 */
const parseTime = (dayAndTime) => {
    // Capture the time-span portion of the day/time string (expecting format
    // "Mon-Thu, Sun 10 am - 10:30 pm" or some variation of this)
    const timeSpanMatches = dayAndTime.match(/(\d+.*$)/);

    // If we didn't get a match on time then bail
    if (!timeSpanMatches || timeSpanMatches.length < 2)
        throw new Error(`Bailed on ${dayAndTime}. No valid time span found.`);

    // Split the open and close times
    const timeSpan = timeSpanMatches[1].split("-");

    // Convert to floating point numbers
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

    // Get the minutes and convert them into a floating number (rounded to 2 decimal places)
    const minutes =
        timeSections.length > 1 && !isNaN(timeSections[1])
            ? Math.round(
                  (parseInt(timeSections[1].trim()) / 60 + Number.EPSILON) * 100
              ) / 100
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
        if (hours === 0 && minutes === 0) {
            hours = 24;
        }
    }

    return hours + minutes;
};

module.exports = { parseTime, convertTimeToNumber };
