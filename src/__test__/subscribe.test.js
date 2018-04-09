/* global beforeAll jest afterAll beforeAll */

jest.setTimeout(10000);

const { Client } = require('pg');
const pgNotify = require('..');

const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
});

beforeAll(async () => {
    await client.connect();

    await client.query(`CREATE TABLE IF NOT EXISTS customer (
        id serial,
        name text,
        location text
    )`);
});


test.only('Must subscribe to a table and fire insert event ', async done => {
    const pgEmiter = await pgNotify.subscribe(client, ['customer']);

    pgEmiter.on('INSERT', data => {
        console.info('Data at insert event -> ', data);
        pgNotify.unsubscribe(client, []);
        done();
    });

    setTimeout(() => {
        client.query('INSERT INTO customer(name, location) values (\'pepe\', \'santiago\')');
    }, 1000);
});


afterAll(async () => {
    await client.query('DROP TRIGGER notify_table_change on customer');
    await client.query('DROP TABLE customer');
});