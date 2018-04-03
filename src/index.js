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

module.exports = {
    create: configNotify('create')
    // force: configNotify('force')
};