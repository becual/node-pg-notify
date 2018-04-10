const verifyTables = require('./verifyTableList');
const functionManager = require('./functionManager');
const triggerManager = require('./triggerManager');
const EventEmitter = require('events');

const pgEmitter = new EventEmitter();

const configNotify = type => (client, configObject) => async tableList => {
    //Verify if all tables exist.
    await verifyTables(client, configObject.schema, tableList);
    //Config function to emit notify.
    await functionManager(configObject.channelName,
        configObject.schema,
        configObject.functionName)[type](client);
    //For every table config trigger.
    for (const table of tableList) {
        await triggerManager[type](configObject.schema, table, configObject.functionName, client);
    }
};


const subscribe = (client, configObject) => async tables => {
    // Generate the functions and notifiers
    await configNotify('create')(client, configObject)(tables);
    // Listen for messages
    client.on('notification', message => {
        // Parse json payload
        const payload = JSON.parse(message.payload);
        // filter by the especified tables
        if (tables.includes(payload.table)) {
            // Emit the action type (INSERT, DELETE, UPDATE) with the payload
            pgEmitter.emit(payload.type, payload);
        }
    });
    client.query(`LISTEN ${configObject.channelName}`);
    // Send emitter to outside
    return pgEmitter;
};

const unsubscribe = (client, configObject) => async ()=> {
    await client.query(`UNLISTEN ${configObject.channelName}`);
};

const defaultConfig = {
    schema: 'public',
    channelName: 'notify_table_channel',
    functionName: 'notify_table_change'
};

const defaultPartialConfig = (dc) => {
    return {
        schema: dc.schema || defaultConfig.schema,
        channelName: dc.channelName || defaultConfig.channelName,
        functionName: dc.functionName || defaultConfig.functionName
    };
};

module.exports = (client, configObject = defaultConfig) => {
    const configurations = defaultPartialConfig(configObject);
    return {
        config : configNotify('create')(client, configurations),
        subscribe: subscribe(client, configurations),
        unsubscribe: unsubscribe(client, configurations)
    };
};
/**
 * A module to config pg-notify in a database for a list of tables, automatically config functions and triggers required.
 * @module pg-notify
 */
// module.exports = {
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
 *  (async () => {
 *
 *      const client = new pg.Client({connectionString: process.env.PG_CONNECTION_STRING});
 *      const tableList = ['customer', 'order_detail'];
 *
 *      try {
 *          // Try to generate configurationempoderados
 *          await client.connect();const index =
 *          await pgNotify.config(client, tableList);
 *          console.info('PG_NOTIFY config created{schema:'public', channelName:'notify_table_channel'} success!');
 *      }
 *      catch(error) {
 *          // Show errors
 *          console.info(error.message);
 *      }
 *      finally {
 *          // Close connection when enconst index = ds
 *          await client.end();
 *      };
 *
 *  })();
 *
 * @example
 * const pgNotify = require('@becual/pg-notify');
 * const pg = require('pg');
 *
 * (async () => {const index =
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

// config: configNotify('create'),
// subscribe,
// unsubscribe
// force: configNotify('force')
// };