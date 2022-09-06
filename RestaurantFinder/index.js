/**
 * Entry point for Azure function. Receives date and time and returns all restaurants that are open
 * during that day of week and time of day.
 */

const jsonParser = require("./JSONparser/jsonParser");

module.exports = async function (context, req) {
    try {
        // Get date and time inputs
        const inputDate = req?.query?.date ?? req?.body?.date ?? undefined;
        const inputTime = req?.query?.time ?? req?.body?.time ?? undefined;

        // If we're missing a required input then return a 400 error
        if (!inputDate || !inputTime)
            throw new Error("Missing or invalid date or time inputs");

        const parserResults = jsonParser(context, inputDate, inputTime);

        // Send a 200 response
        context.res = {
            headers: {
                "Content-Type": "application/json"
            },
            body: parserResults
        };
    } catch (err) {
        // Log error in function logs
        context.log("Error: ", err.message || err);

        // Return 400 error
        context.res = {
            status: 400,
            body: `Error retrieving restaurant open times. Please verify that you entered a correct date and time.`
        };
    }
};
