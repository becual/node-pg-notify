<a name="module_pg-notify"></a>

## pg-notify
A module to config pg-notify in a database for a list of tables, automatically config functions and triggers required.

<a name="module_pg-notify.config"></a>

### pg-notify.config ⇒ <code>Promise</code>
Create the functions and triggers to configure pg-notify for a list of tables.

**Kind**: static property of [<code>pg-notify</code>](#module_pg-notify)  
**Returns**: <code>Promise</code> - A promise that will implement the pg-notify config.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| client | <code>object</code> |  | A pg client connected to the database. |
| tableList | <code>Array.&lt;string&gt;</code> |  | The list of tables to notify. |
| schema | <code>string</code> | <code>&quot;public&quot;</code> | Name of the schema where the tables exists. |
| functionName | <code>string</code> | <code>&quot;notify_table_change&quot;</code> | Name of the function to use notify. |
| channelName | <code>string</code> | <code>&quot;notify_table_change_channel&quot;</code> | Name of the channel where the function notify. |

**Example**  
```js
const pgNotify = require('@becual/pg-notify');
const pg = require('pg');

(async () => {

    const client = new pg.Client({connectionString: process.env.PG_CONNECTION_STRING});
    await client.connect();

    const tableList = ['customer', 'order', 'order_detail'];
    await pgNotify.config(client, tableList);

    await client.end();

})();
```
**Example**  
```js
const pgNotify = require('@becual/pg-notify');
const pg = require('pg');

(async () => {

    const client = new pg.Client({connectionString: process.env.PG_CONNECTION_STRING});
    await client.connect();

    const tableList = ['customer', 'order', 'order_detail'];
    await pgNotify.config(client, tableList, 'otherSchema', 'aFunctionName', 'aChannelName');

    await client.end();

})();
```
**Example**  
```js
const pgNotify = require('@becual/pg-notify');
const pg = require('pg');

(async () => {

    const client = new pg.Client({connectionString: process.env.PG_CONNECTION_STRING});
    await client.connect();

    const tableList = ['customer', 'order', 'order_detail'];
    await pgNotify.config(client, tableList, null, null, 'justChannelName');

    await client.end();

})();
```
