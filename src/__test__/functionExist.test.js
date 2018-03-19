const { Client } = require('pg');
const table_name = 'notify_table_change';
const fne = require('../functionManager/functionExist')(table_name);
const fnc = require('../functionManager/createFunction')(table_name);
const fnd = require('../functionManager/deleteFunction')(table_name);
const ofn = require('../functionManager')(table_name);
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