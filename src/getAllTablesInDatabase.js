const sqlTables = schema => `SELECT tablename FROM pg_tables WHERE schemaname='${schema}'`;
const R = require('ramda');

module.exports = async (dbConfig) => {
    const result = await dbConfig.client.query(sqlTables(dbConfig.schema));
    return R.reduce((acc, elem) => {
        return R.append(elem.tablename, acc);
    }, [], result.rows);
};