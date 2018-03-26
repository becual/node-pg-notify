const sqlCreateTrigger = (functionName, tableName) => `CREATE TRIGGER
    ${functionName}_on_${tableName}
    AFTER INSERT OR UPDATE OR DELETE
    ON ${tableName}
    FOR EACH ROW EXECUTE PROCEDURE ${functionName}();`;

module.exports = (functionName, tableName)=> async client => {
    let sql = sqlCreateTrigger(functionName, tableName);
    return client.query(sqlCreateTrigger(functionName, tableName));
};