const triggerExist = require('./triggerExist');
const triggerCreate = require('./createTrigger');
const triggerDelete = require('./deleteTrigger');

const forceOrCreate = (force = false, triggerName, tableName, functionName) => async (client) => {
    const exist = await triggerExist(triggerName, tableName, client);
    if (!exist) {
        await triggerCreate(triggerName, tableName, functionName)(client);
    } else if (force) {
        await triggerDelete(triggerName)(client);
        await triggerCreate(triggerName, tableName, functionName)(client);
    }
};

module.exports = (tableName,
    functionName = 'notify_table_change') => {
        const triggerName = `${functionName}_on_${triggerName}`;
    return {
        create: forceOrCreate(false, triggerName, tableName, functionName),
        force: forceOrCreate(true, triggerName, tableName, functionName)
    };
};