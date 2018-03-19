const util = require('util');
const sqlDeleteFunction = (fn) => `DROP FUNCTION ${fn};`;

module.exports = functionName => async client => {
    await client.query(sqlDeleteFunction(functionName));
};