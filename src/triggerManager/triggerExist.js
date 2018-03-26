const R = require('ramda');
const sqlTriggerExist = (tgTable) => `SELECT *
    FROM pg_trigger where not tgisinternal AND tgrelid ='${tgTable}'::regclass`;

module.exports = async (tgName, tgTable, client) => {
    let res = await client.query(sqlTriggerExist(tgTable));
    const triggers = R.reduce((acc, elem) => R.append(elem.tgname, acc), [], res.rows);
    return R.contains(tgName, triggers);

};