const util = require('util');
const R = require('ramda');
const sqlFunction = `SELECT p.oid::regprocedure
        FROM pg_proc p
        JOIN pg_namespace n
        ON p.pronamespace = n.oid
        WHERE n.nspname NOT IN('pg_catalog', 'information_schema');`;

module.exports = funcName => async client => {
    let res = await client.query(sqlFunction);
    return R.contains(funcName, res.rows);
};