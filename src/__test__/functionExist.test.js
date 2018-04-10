/* global beforeAll afterAll expect */
const { Client } = require('pg');
const channel = 'notify_table_change_channel';
const tableName = 'notify_table_change';
const schema = 'public';
const fne = require('../functionManager/functionExist')(schema, tableName);
const fnc = require('../functionManager/createFunction')(channel, schema, tableName);
const fnd = require('../functionManager/deleteFunction')(schema, tableName);
const ofn = require('../functionManager')(channel, schema, tableName);
const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
});

beforeAll( async ()=> {
    await client.connect();
});

afterAll( async () => {
    await fnd(client);
    await client.end();
});

test('Function must not exist', async () => {
    const result = await fne(client);
    expect(result).toBe(false);
});

test('Function must exist', async ()=>{
    await fnc(client);
    const result = await fne(client);
    expect(result).toBe(true);
});


test('Object must create function', async () =>{
    await ofn.create(client);
    const result = await fne(client);
    expect(result).toBe(true);
});

test('Object must force function creation', async () =>{
    await ofn.force(client);
    const result = await fne(client);
    expect(result).toBe(true);
});

test('Object must create function and function must not exists', async () =>{
    await fnd(client);
    await ofn.create(client);
    const result = await fne(client);
    expect(result).toBe(true);
});

test('Object must create function and function must not exists with force', async () =>{
    await fnd(client);
    await ofn.force(client);
    const result = await fne(client);
    expect(result).toBe(true);
});