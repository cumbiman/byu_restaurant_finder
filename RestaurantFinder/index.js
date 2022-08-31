module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req?.query?.name ?? (req?.body?.name) ?? undefined );

    const responseMessage = name
        ? "Hello " + name
        : "No name was received";

    context.res = {
        body: responseMessage
    };
}