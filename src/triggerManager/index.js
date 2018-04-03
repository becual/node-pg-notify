const triggerExist = require('./triggerExist');
const triggerCreate = require('./createTrigger');
const triggerDelete = require('./deleteTrigger');

const forceOrCreate = (force = false) => async (tableName, functionName, client) => {
    const triggerName = `${functionName}_on_${tableName}`;
    const exist = await triggerExist(triggerName, tableName, client);
    if (!exist) {
        await triggerCreate(triggerName, tableName, functionName)(client);
    }
    else if (force) {
        await triggerDelete(triggerName, tableName)(client);
        await triggerCreate(triggerName, tableName, functionName)(client);
    }
};

module.exports = {
    create: forceOrCreate(false),
    force: forceOrCreate(true)
};