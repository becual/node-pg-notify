/* global beforeAll jest expect */

jest.setTimeout(30000);

const { Client } = require('pg');
const pgNotify = require('..');

const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
});

beforeAll(async () => {
    await client.connect();
});


test.only('Must subscribe to a table', async done => {
    const pgEmiter = await pgNotify.subscribe(client, ['customer']);

    pgEmiter.on('INSERT', data => {
        console.info('data at insert -> ', data);
        done();
    });
});