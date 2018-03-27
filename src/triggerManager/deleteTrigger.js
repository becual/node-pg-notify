const sqlDeleteFunction = (tn) => `DROP TRIGGER ${tn};`;

module.exports = triggerName => async client => {
    await client.query(sqlDeleteFunction(triggerName));
};