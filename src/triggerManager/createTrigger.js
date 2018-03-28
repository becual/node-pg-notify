const sqlCreateTrigger = (triggerName, tableName, functionName) => `CREATE TRIGGER
    ${triggerName}
    AFTER INSERT OR UPDATE OR DELETE
    ON ${tableName}
    FOR EACH ROW EXECUTE PROCEDURE ${functionName}();`;

module.exports = (triggerName, tableName, functionName)=> async client => {
    return client.query(sqlCreateTrigger(triggerName, tableName, functionName));
};