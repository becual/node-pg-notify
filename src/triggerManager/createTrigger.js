const sqlCreateTrigger = (functionName, tableName) => `CREATE OR REPLACE TRIGGER
    ${functionName}_on_${tableName}
    AFTER INSERT OR UPDATE OR DELETE
    ON ${tableName}
    FOR EACH ROW EXECUTE PROCEDURE ${functionName};`;

module.exports = (functionName, tableName)=> async client => {
    return client.query(sqlCreateTrigger(functionName, tableName));
};