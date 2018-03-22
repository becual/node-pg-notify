const getTables = require('./getAllTablesInDatabase');
const R = require('ramda');

module.exports = async (dbConfig, tableList) => {
    const result = await getTables(dbConfig);
    const diff = R.difference(tableList, result);
    const largo = diff.length;
    if(largo > 0)
        throw new Error(`The table${largo === 1 ? '' : 's'} ${diff.join(', ')} ${largo === 1 ? 'is' : 'are'} not part of the database`);
};