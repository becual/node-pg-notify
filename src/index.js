const verifyTables = require('./verifyTableList');
const functionManager = require('./functionManager');
const triggerManager = require('./triggerManager');

module.exports = async (client,
    tableList,
    schema='public',
    functionName='notify_table_change',
    channelName='notify_table_change_channel') => {
    await verifyTables(client, schema, tableList);
    await functionManager(channelName, functionName).create(client);
    for (const table of tableList) {
        await triggerManager.create(table, functionName, client);
    }
};