const R = require('ramda');
const sqlGetAllFunctions = `SELECT p.oid::regprocedure
        FROM pg_proc p
        JOIN pg_namespace n
        ON p.pronamespace = n.oid
        WHERE n.nspname NOT IN('pg_catalog', 'information_schema');`;

module.exports = functionName => async client => {
    let res = await client.query(sqlGetAllFunctions);
    return R.reduce((acc, elem) => acc || elem.oid === `${functionName}()`, false, res.rows);
};