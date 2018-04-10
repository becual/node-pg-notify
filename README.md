<a name="module_pg-notify"></a>

## pg-notify
Configure and subscribe to Postgres Notify automatically for a given set of tables.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| client | <code>object</code> |  | node-postgres Client instance |
| configObject | <code>object</code> |  | Configuration object |
| configObject.schema | <code>string</code> | <code>&quot;public&quot;</code> | Name of the schema where the tables exists. |
| configObject.functionName | <code>string</code> | <code>&quot;notify_table_change&quot;</code> | Name of the function to use notify. |
| configObject.channelName | <code>string</code> | <code>&quot;notify_table_change_channel&quot;</code> | Name of the channel where the function will notify. |


* [pg-notify](#module_pg-notify)
    * [~Subscribe to all database events of a given list of tables(tables)](#module_pg-notify..Subscribe to all database events of a given list of tables) ⇒ <code>EventEmitter</code>
    * [~Create the functions and triggers to configure pg-notify.(tables)](#module_pg-notify..Create the functions and triggers to configure pg-notify.) ⇒ <code>Promise</code>

<a name="module_pg-notify..Subscribe to all database events of a given list of tables"></a>

### pg-notify~Subscribe to all database events of a given list of tables(tables) ⇒ <code>EventEmitter</code>
**Kind**: inner method of [<code>pg-notify</code>](#module_pg-notify)  
**Returns**: <code>EventEmitter</code> - A nodejs EventEmitter which emits when any of the listed tables changes.  

| Param | Type | Description |
| --- | --- | --- |
| tables | <code>Array.&lt;string&gt;</code> | An array of table names to listen |

**Example**  
```js
const { Client }  = require('pg');
 const pgNotify = require('@becual/pg-notify');

 let eventHandler = evt => {
     console.log(JSON.stringify(evt, null, 4));
 };

 (async () => {
     // Use your connection string
     const client = new Client({ connectionString: process.env.PG_CONNECTION_STRING });
     const tables = ['customer', 'order_detail'];

    try {
        // Connect client
        await client.connect();

        // By default schema is public
        const sub = await pgNotify(client, {schema: 'mySchema'}).subscribe(tables);

        // listen actions
        sub.on('INSERT', eventHandler);
        sub.on('UPDATE', eventHandler);
        sub.on('DELETE', eventHandler);
    }
    catch(error) {
        console.log(error.message);
    }
    finally {
        await client.end();
    }
 })();
```
<a name="module_pg-notify..Create the functions and triggers to configure pg-notify."></a>

### pg-notify~Create the functions and triggers to configure pg-notify.(tables) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>pg-notify</code>](#module_pg-notify)  
**Returns**: <code>Promise</code> - A promise that will implement the pg-notify config.  

| Param | Type | Description |
| --- | --- | --- |
| tables | <code>Array.&lt;string&gt;</code> | The list of tables to create pg notify configuration. |

**Example**  
```js
const { Client } = require('pg');
 const pgNotify = require('@becual/pg-notify');

 (async () => {

     const client = new Client({ connectionString: process.env.PG_CONNECTION_STRING });
     const tableList = ['customer', 'order_detail'];

     try {
         // Try to generate configuratio
         await client.connect();
         await pgNotify(client, {schema: 'mySchema'}).config(tableList);
     }
     catch(error) {
         // Show errors
         console.log(error.message);
     }
     finally {
         // Close connection
         await client.end();
     }
 })();
```
