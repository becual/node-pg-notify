const functionExist = require('./functionExist');
const functionCreate = require('./createFunction');
const functionDelete = require('./deleteFunction');

const forceOrCreate = (force = false, channel, schema, functionName) => async (client) => {    
    const exist = await functionExist(schema, functionName)(client);
    if (!exist) {
        await functionCreate(channel, schema, functionName)(client);
    }
    else if (force) {
        await functionDelete(schema, functionName)(client);
        await functionCreate(channel, schema, functionName)(client);
    }
};

module.exports = (channel = 'notify_table_change_channel',
    schema = 'public',
    functionName = 'notify_table_change') => {
    return {
        create: forceOrCreate(false, channel, schema, functionName),
        force: forceOrCreate(true, channel, schema, functionName)
    };
};