/**
 * Entry point for Azure function. Receives date and time and returns all restaurants that are open
 * during that day of week and time of day.
 */

const findRestaurants = require("./findRestaurants/findRestaurants");

module.exports = async function (context, req) {
    try {
        // Get date and time user inputs
        const inputDate = req?.query?.date ?? req?.body?.date ?? undefined;
        const inputTime = req?.query?.time ?? req?.body?.time ?? undefined;

        // If we're missing a required input then return a 400 error
        if (!inputDate || !inputTime)
            throw new Error("Missing or invalid date or time inputs");

        const parserResults = findRestaurants(context, inputDate, inputTime);

        // Send the response from findRestaurants
        context.res = parserResults;
    } catch (err) {
        // Log error in function logs
        context.log("Error: ", err.message || err);

        // Return 400 error
        context.res = {
            status: 400,
            headers: {
                "Content-Type": "text/plain"
            },
            body: `Error retrieving restaurant open times. Please verify that you entered a correct date and time.`
        };
    }
};
