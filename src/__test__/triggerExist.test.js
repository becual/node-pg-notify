/* global beforeAll afterAll expect */
const { Client } = require('pg');
const fs = require('fs');
const functionName = 'notify_table_change_channel';
const triggerName = 'notify_table_change_channel_on_films';
const badTriggerName = 'un_trigger_que_no_existe';
const tableName = 'films';
const tableCinema = 'cinemas';
const channel = 'notify_table_change_channel';
const triggerExist = require('../triggerManager/triggerExist');
const triggerCreate = require('../triggerManager/createTrigger');
const fnc = require('../functionManager/createFunction')(channel, functionName);
const tg = require('../triggerManager');
const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
});

beforeAll( async ()=> {
    await client.connect();
    const createTable = fs.readFileSync(`${__dirname}/createTables.sql`, 'utf-8');
    await client.query(createTable);
    await fnc(client);
    try {
        await triggerCreate(triggerName, tableName, functionName)(client);
    }
    catch(e){
        console.info('Error en beforeAll', e);
    }
});

afterAll( async () => {
    await client.query(`DROP TRIGGER ${triggerName} on ${tableName}`);
    const deleteTable = fs.readFileSync(`${__dirname}/dropTables.sql`, 'utf-8');
    await client.query(deleteTable);
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

test('Object must create trigger', async () => {
    await tg.create(tableCinema, functionName, client);
    const toFind = `${functionName}_on_${tableCinema}`;
    const result = await triggerExist(toFind, tableCinema, client);
    expect(result).toBe(true);
});

test('Object must force create trigger', async () => {
    await tg.force(tableCinema, functionName, client);
    const toFind = `${functionName}_on_${tableCinema}`;
    const result = await triggerExist(toFind, tableCinema, client);
    expect(result).toBe(true);
});