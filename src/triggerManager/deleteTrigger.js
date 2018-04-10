const sqlDeleteFunction = (tgn, sn, tn) => `DROP TRIGGER ${tgn} ON ${sn}.${tn};`;

module.exports = (triggerName, schemaName, tableName) => async client => {
    await client.query(sqlDeleteFunction(triggerName, schemaName, tableName));
};