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

const unsubscribe = (client, configObject) => async () => {
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



/**
* Configure and subscribe to Postgres Notify automatically for a given set of tables.
* @module pg-notify
* @param {object} client - node-postgres Client instance
* @param {object} configObject - Configuration object
* @param {string} configObject.schema=public - Name of the schema where the tables exists.
* @param {string} configObject.functionName=notify_table_change - Name of the function to use notify.
* @param {string} configObject.channelName=notify_table_change_channel - Name of the channel where the function will notify.
*/

module.exports = (client, configObject = defaultConfig) => {
    const configurations = defaultPartialConfig(configObject);
    return {
        /**
        * @method Subscribe to all database events of a given list of tables
        * @param {string[]} tables - An array of table names to listen
        * @returns { Promise } a promise wich resolves an NodeJS EventEmitter
        *
        * @example
        *  const { Client }  = require('pg');
        *  const pgNotify = require('@becual/pg-notify');
        *
        *  let eventHandler = evt => {
        *      console.log(JSON.stringify(evt, null, 4));
        *  };
        *
        *  (async () => {
        *      // Use your connection string
        *      const client = new Client({ connectionString: process.env.PG_CONNECTION_STRING });
        *
        *      // Choose your tables to listen
        *      const tables = ['customer', 'order_detail'];
        *
        *     try {
        *         // Connect client
        *         await client.connect();
        *
        *         // By default schema is public
        *         const sub = await pgNotify(client, {schema: 'mySchema'}).subscribe(tables);
        *
        *         // Listen for changes
        *         sub.on('INSERT', eventHandler);
        *         sub.on('UPDATE', eventHandler);
        *         sub.on('DELETE', eventHandler);
        *     }
        *     catch(error) {
        *         console.log(error.message);
        *         await client.end();
        *     }
        *  })();
        */
        subscribe: subscribe(client, configurations),


        /**
        * @method Create the functions and triggers to configure pg-notify.
        * @param {string[]} tables - The list of tables to create pg notify configuration.
        * @returns {Promise} A promise that will implement the pg-notify config.
        *
        * @example
        *
        *  const { Client } = require('pg');
        *  const pgNotify = require('@becual/pg-notify');
        *
        *  (async () => {
        *
        *      const client = new Client({ connectionString: process.env.PG_CONNECTION_STRING });
        *      const tableList = ['customer', 'order_detail'];
        *
        *      try {
        *          // Try to generate configuration
        *          await client.connect();
        *          await pgNotify(client, {schema: 'mySchema'}).config(tableList);
        *      }
        *      catch(error) {
        *          // Show errors
        *          console.log(error.message);
        *      }
        *      finally {
        *          // Close connection
        *          await client.end();
        *      }
        *  })();
        */

        config: configNotify('create')(client, configurations),

        unsubscribe: unsubscribe(client, configurations)
    };
};
