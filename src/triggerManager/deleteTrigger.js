const sqlDeleteFunction = (tgn, tn) => `DROP TRIGGER ${tgn} ON ${tn};`;

module.exports = (triggerName, tableName) => async client => {
    await client.query(sqlDeleteFunction(triggerName, tableName));
};