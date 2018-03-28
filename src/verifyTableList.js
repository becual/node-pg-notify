const getTables = require('./getAllTablesInDatabase');
const R = require('ramda');

module.exports = async (dbConfig, tableList) => {
    const result = await getTables(dbConfig);
    const diff = R.difference(tableList, result);
    const largo = diff.length;
    if(0 < largo){
        /* eslint-disable-next-line no-alert */
        throw new Error(`The table${1 === largo ? '' : 's'} ${diff.join(', ')} ${1 === largo ? 'is' : 'are'} not part of the database`);
    }
};