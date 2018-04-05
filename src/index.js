const verifyTables = require('./verifyTableList');
const functionManager = require('./functionManager');
const triggerManager = require('./triggerManager');

const configNotify = type => async (client,
    tableList,
    schema='public',
    functionName='notify_table_change',
    channelName='notify_table_change_channel') => {
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
     * const pgNotify = require('pg-notify');
     * const pg = require('pg');
     * const client = new Client({connectionString: process.env.PG_CONNECTION_STRING});
     *
     * const tableList = ['customer', 'order', 'order_detail'];
     * await pgNotify.config(client, tableList);
     *
     * @example
     * const pgNotify = require('pg-notify');
     * const pg = require('pg');
     * const client = new Client({connectionString: process.env.PG_CONNECTION_STRING});
     *
     * const tableList = ['customer', 'order', 'order_detail'];
     * await pgNotify.config(client, tableList, 'otherSchema', 'aFunctionName', 'aChannelName');
     *
     * @example
     * const pgNotify = require('pg-notify');
     * const pg = require('pg');
     * const client = new Client({connectionString: process.env.PG_CONNECTION_STRING});
     *
     * const tableList = ['customer', 'order', 'order_detail'];
     * await pgNotify.config(client, tableList, null, null, 'justChannelName');
     */
    config: configNotify('create')
    // force: configNotify('force')
};