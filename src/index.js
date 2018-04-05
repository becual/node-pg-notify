const verifyTables = require('./verifyTableList');
const functionManager = require('./functionManager');
const triggerManager = require('./triggerManager');

const configNotify = type => async (client,
    tableList,
    schema = 'public',
    functionName = 'notify_table_change',
    channelName = 'notify_table_change_channel') => {
    await verifyTables(client, schema, tableList);
    await functionManager(channelName, functionName)[type](client);
    for (const table of tableList) {
        await triggerManager[type](table, functionName, client);
    }
};
/**
 * A module to config pg-notify in a database for a list of tables, automatically config functions and triggers required.
 * @module pg-notify
 */
module.exports = {
    /**
     * Create the functions and triggers to configure pg-notify for a list of tables.
     * @param {object} client - A pg client connected to the database.
     * @param {string[]} tableList - The list of tables to notify.
     * @param {string} schema=public - Name of the schema where the tables exists.
     * @param {string} functionName=notify_table_change - Name of the function to use notify.
     * @param {string} channelName=notify_table_change_channel - Name of the channel where the function notify.
     * @returns {Promise} A promise that will implement the pg-notify config.
     *
     * @example
     * const pgNotify = require('@becual/pg-notify');
     * const pg = require('pg');
     *
     * (async () => {
     *
     *     const client = new pg.Client({connectionString: process.env.PG_CONNECTION_STRING});
     *     await client.connect();
     *
     *     // Must create tables first
     *     const tableList = ['customer', 'order_detail'];
     *     await pgNotify.config(client, tableList);
     *
     *     await client.end();
     *
     * })();
     * @example
     * const pgNotify = require('@becual/pg-notify');
     * const pg = require('pg');
     *
     * (async () => {
     *
     *     const client = new pg.Client({connectionString: process.env.PG_CONNECTION_STRING});
     *     await client.connect();
     *
     *     // Must create tables first
     *     const tableList = ['customer', 'order_detail'];
     *     await pgNotify.config(client, tableList, 'otherSchema', 'aFunctionName', 'aChannelName');
     *
     *     await client.end();
     *
     * })();
     * @example
     * const pgNotify = require('@becual/pg-notify');
     * const pg = require('pg');
     *
     * (async () => {
     *
     *     const client = new pg.Client({connectionString: process.env.PG_CONNECTION_STRING});
     *     await client.connect();
     *
     *     // Must create tables first
     *     const tableList = ['customer', 'order_detail'];
     *     await pgNotify.config(client, tableList, null, null, 'justChannelName');
     *
     *     await client.end();
     *
     * })();
     */
    
    config: configNotify('create')
    // force: configNotify('force')
};