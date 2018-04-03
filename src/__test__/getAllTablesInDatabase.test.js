/* global beforeAll afterAll expect */
const { Client } = require('pg');
const getAllTables = require('../getAllTablesInDatabase');
const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
});
const fs = require('fs');
const R = require('ramda');

beforeAll( async ()=> {
    await client.connect();
    const createTable = fs.readFileSync(`${__dirname}/createTables.sql`, 'utf-8');
    await client.query(createTable);
});

afterAll( async () => {
    const deleteTable = fs.readFileSync(`${__dirname}/dropTables.sql`, 'utf-8');
    await client.query(deleteTable);
    await client.end();
});

test('Get All Tables', async () => {
    const result = await getAllTables(client, 'public');
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(5);
    R.map( elem => {
        expect(typeof elem).toBe('string');
        return elem;
    }, result);
});