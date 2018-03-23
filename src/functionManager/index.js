const functionExist = require('./functionExist');
const functionCreate = require('./createFunction');
const functionDelete = require('./deleteFunction');

const forceOrCreate = (force = false, channel, functionName) => async (client) => {
    const exist = await functionExist(functionName)(client);
    if (!exist) {
        await functionCreate(channel, functionName)(client);
    } else if (force) {
        await functionDelete(functionName)(client);
        await functionCreate(channel, functionName)(client);
    }
};

module.exports = (channel = 'notify_table_change_channel',
    functionName = 'notify_table_change') => {
    return {
        create: forceOrCreate(false, channel, functionName),
        force: forceOrCreate(true, channel, functionName)
    };
};