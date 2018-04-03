const getTables = require('./getAllTablesInDatabase');
const R = require('ramda');

module.exports = async (client, schema='public', tableList) => {
    const result = await getTables(client, schema);
    const diff = R.difference(tableList, result);
    const largo = diff.length;
    if(0 < largo){
        const table = 1 === largo ? 'table' : 'tables';
        const ia = 1 === largo ? 'is' : 'are';
        throw new Error(`The ${table} ${diff.join(', ')} ${ia} not part of the database`);
    }
};