const R = require('ramda');
const sqlGetAllFunctions = `SELECT p.oid::regprocedure
        FROM pg_proc p
        JOIN pg_namespace n
        ON p.pronamespace = n.oid
        WHERE n.nspname NOT IN('pg_catalog', 'information_schema');`;

module.exports = (schema, functionName) => async client => {
    let res = await client.query(sqlGetAllFunctions);
    const name = (sn, fn) => 'public' === sn ? `${fn}()` : `${sn}.${fn}()`;
    return R.reduce((acc, elem) => acc || elem.oid === name(schema, functionName),
        false,
        res.rows);
};