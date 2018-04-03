/* global beforeAll afterAll expect */
const { Client } = require('pg');
const verifyTableList = require('../verifyTableList');
const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
});
const fs = require('fs');

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

test('Not all tables are in the database', async () => {
    try{
        await verifyTableList(client, 'public', ['La_la_la']);
    }
    catch (e){
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('The table La_la_la is not part of the database');
    }
});

test('Plural Not all tables are in the database', async () => {
    try{
        await verifyTableList(client, 'public', ['La_la_la', 'lo_lo_lo']);
    }
    catch (e){
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('The tables La_la_la, lo_lo_lo are not part of the database');
    }
});

test('Not all tables exist', async () => {
    try{
        await verifyTableList(client, 'public', ['films', 'distributors', 'La_la_la', 'lo_lo_lo']);
    }
    catch (e){
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('The tables La_la_la, lo_lo_lo are not part of the database');
    }
});

test('All tables exist', async () => {
    try{
        await verifyTableList(client, 'public', ['films', 'distributors']);
    }
    catch (e){
        expect(e).toBeFalsy();
    }
});