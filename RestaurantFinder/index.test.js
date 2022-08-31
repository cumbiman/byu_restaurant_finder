const httpFunction = require('./index');
const context = require('../testing/defaultContext');

test('Http trigger should return a generic response (no name)', async () => {
    const request = {};

    await httpFunction(context, request);

    expect(context.log.mock.calls.length).toBe(1);
    expect(context.res.body).toEqual('No name was received');
});

test('Http trigger should return a response with a name', async () => {

    const request = {
        query: { name: 'Dave' }
    };

    await httpFunction(context, request);

    expect(context.log.mock.calls.length).toBe(2);
    expect(context.res.body).toEqual('Hello Dave');
});