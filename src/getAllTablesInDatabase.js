const sqlTables = schema => `SELECT tablename FROM pg_tables WHERE schemaname='${schema}'`;
const R = require('ramda');

module.exports = async (client, schema) => {
    const result = await client.query(sqlTables(schema));
    return R.reduce((acc, elem) => {
        return R.append(elem.tablename, acc);
    }, [], result.rows);
};