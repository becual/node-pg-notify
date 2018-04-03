/* global beforeAll afterAll */
const { Client } = require('pg');
const fs = require('fs');
const tableList = ['films', 'distributors', 'circles', 'cinemas', 'some_table'];
const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
});
const index = require('../index');

beforeAll( async ()=> {
    await client.connect();
    const createTable = fs.readFileSync(`${__dirname}/createTables.sql`, 'utf-8');
    await client.query(createTable);
});

afterAll( async () => {
    const createDropTrigger =
    (tableName)=> `DROP TRIGGER notify_table_change_on_${tableName} on ${tableName};`;
    for(let table of tableList){
        await client.query(createDropTrigger(table));
    }
    await client.query('DROP FUNCTION notify_table_change;');
    const deleteTable = fs.readFileSync(`${__dirname}/dropTables.sql`, 'utf-8');
    await client.query(deleteTable);
    await client.end();
});

test('Config with create', async () => {
    await index.create(client, tableList);
});
/*
test('Config with force', async () => {
    await index.force(client, tableList);
}); */