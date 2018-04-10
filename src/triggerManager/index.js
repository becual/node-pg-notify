const triggerExist = require('./triggerExist');
const triggerCreate = require('./createTrigger');
const triggerDelete = require('./deleteTrigger');

const forceOrCreate = (force = false) => async (schemaName, tableName, functionName, client) => {
    const triggerName = `${functionName}_on_${tableName}`;
    const exist = await triggerExist(triggerName, schemaName, tableName, client);
    if (!exist) {
        await triggerCreate(triggerName, schemaName, tableName, functionName)(client);
    }
    else if (force) {
        await triggerDelete(triggerName, schemaName, tableName)(client);
        await triggerCreate(triggerName, schemaName, tableName, functionName)(client);
    }
};

module.exports = {
    create: forceOrCreate(false),
    force: forceOrCreate(true)
};