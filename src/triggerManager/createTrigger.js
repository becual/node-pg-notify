const sqlCreateTrigger = (tableName, functionName) => `CREATE TRIGGER
    ${functionName}_on_${tableName}
    AFTER INSERT OR UPDATE OR DELETE
    ON ${tableName}
    FOR EACH ROW EXECUTE PROCEDURE ${functionName}();`;

module.exports = (tableName, functionName)=> async client => {
    return client.query(sqlCreateTrigger(tableName, functionName));
};