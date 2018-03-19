const { Client } = require('pg');
const table_name = 'notify_table_change';
const fne = require('../functionExist')(table_name);
const fnc = require('../createFunction')(table_name);
const fnd = require('../deleteFunction')(table_name);
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