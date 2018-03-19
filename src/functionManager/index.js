const functionExist = require('./functionExist');
const functionCreate = require('./createFunction');
const functionDelete = require('./deleteFunction');

const forceOrCreate = (force = false, functionName) => async (client) => {
    const exist = await functionExist(functionName)(client);
    if (!exist) {
        await functionCreate(functionName)(client);
    } else if (force) {
        await functionDelete(functionName)(client);
        await functionCreate(functionName)(client);
    }
};

module.exports = (functionName = 'notify_table_change') => {
    return {
        create: forceOrCreate(false, functionName),
        force: forceOrCreate(true, functionName)
    };
};