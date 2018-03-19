const {Client} = require('pg');
const fne = require('../functionExist');

test('Function must not exist', async ()=> {
    const client = new Client({
        connectionString: process.env.PG_CONNECTION_STRING
    });
    await client.connect();
    const result = await fne('notify_table_change')(client);
    expect(result).toBe(false);

});