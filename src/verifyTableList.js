const getTables = require('./getAllTablesInDatabase');
const R = require('ramda');

module.exports = async (dbConfig, tableList) => {
    const result = await getTables(dbConfig);
    const diff = R.difference(tableList, result);
    const largo = diff.length;
    if(0 < largo){
        const table = 1 === largo ? 'table' : 'tables';
        const ia = 1 === largo ? 'is' : 'are';
        throw new Error(`The ${table} ${diff.join(', ')} ${ia} not part of the database`);
    }
};