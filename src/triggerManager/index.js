const triggerExist = require('./triggerExist');
const triggerCreate = require('./createTrigger');
const triggerDelete = require('./deleteTrigger');

const forceOrCreate = (force = false, tableName, functionName) => async (client) => {
    const exist = await triggerExist(functionName)(client);
    if (!exist) {
        await triggerCreate(tableName, functionName)(client);
    } else if (force) {
        await triggerDelete(functionName)(client);
        await triggerCreate(tableName, functionName)(client);
    }
};

module.exports = (tableName,
    functionName = 'notify_table_change') => {
    return {
        create: forceOrCreate(false, tableName, functionName),
        force: forceOrCreate(true, tableName, functionName)
    };
};