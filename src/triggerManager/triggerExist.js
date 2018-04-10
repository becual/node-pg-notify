const R = require('ramda');
const sqlTriggerExist = (tgSchema, tgTable) => `SELECT *
    FROM pg_trigger where not tgisinternal AND tgrelid ='${tgSchema}.${tgTable}'::regclass`;

module.exports = async (tgName, tgSchema, tgTable, client) => {
    let res = await client.query(sqlTriggerExist(tgSchema, tgTable));
    const triggers = R.reduce((acc, elem) => R.append(elem.tgname, acc), [], res.rows);
    return R.contains(tgName, triggers);

};