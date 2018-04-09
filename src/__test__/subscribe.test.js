/* global beforeAll jest afterAll beforeAll */

jest.setTimeout(10000);

const {
    Client
} = require('pg');
const pgNotify = require('..');

let client = null;

beforeAll(async () => {
    client = new Client({
        connectionString: process.env.PG_CONNECTION_STRING
    });

    await client.connect();

    await client.query(`CREATE TABLE IF NOT EXISTS customer (
        id serial,
        name text,
        location text
    )`);
});

test.only('Must subscribe to a table and fire insert event ', async done => {
    const pgEmiter = await pgNotify(client).subscribe(['customer']);

    pgEmiter.on('INSERT', data => {
        console.info('Data at insert event -> ', data);
        done();
    });

    setTimeout(() => {
        client.query('INSERT INTO customer(name, location) values (\'pepe\', \'santiago\')');
    }, 1000);
});


afterAll(async () => {
    console.info('In the after all');
    try {
        await client.query('DROP TABLE customer');
        await client.query('DROP FUNCTION notify_table_change()');
        await pgNotify(client).unsubscribe();
    }
    catch (e){
        console.info('Error cached', e);
    }
    await client.end();
});