const { Client } = require('pg');
const functionName = 'notify_table_change_channel';
const triggerName = 'notify_table_change_on_films';
const badTriggerName = 'un_trigger_que_no_existe';
const tableName = 'films';
const triggerExist = require('../triggerManager/triggerExist');
const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
});

beforeAll( async ()=> {
    await client.connect();
});

afterAll( async () => {
    await client.end();
});

test('Trigger must exist', async () => {
    const result = await triggerExist(triggerName, tableName, client);
    expect(result).toBe(true);
});

test('Trigger must not exist', async () => {
    const result = await triggerExist(badTriggerName, tableName, client);
    expect(result).toBe(false);
});