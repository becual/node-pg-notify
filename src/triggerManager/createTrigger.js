const sqlCreateTrigger = (triggerName, schemaName, tableName, functionName) => `CREATE TRIGGER
    ${triggerName}
    AFTER INSERT OR UPDATE OR DELETE
    ON ${schemaName}.${tableName}
    FOR EACH ROW EXECUTE PROCEDURE ${functionName}();`;

module.exports = (triggerName, schemaName, tableName, functionName)=> async client => {
    return client.query(sqlCreateTrigger(triggerName, schemaName, tableName, functionName));
};