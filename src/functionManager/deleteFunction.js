const sqlDeleteFunction = (schema, fn) => `DROP FUNCTION ${schema}.${fn};`;

module.exports = (schema, functionName) => async client => {
    await client.query(sqlDeleteFunction(schema, functionName));
};