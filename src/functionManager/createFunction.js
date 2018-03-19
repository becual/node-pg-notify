const util = require('util');
const sqlCreateFunction = (fn) => {
    return `
        CREATE OR REPLACE FUNCTION ${fn}() RETURNS trigger AS $$
        DECLARE
          id bigint;
        BEGIN
          IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
            id = NEW.id;
          ELSE
            id = OLD.id;
          END IF;
          PERFORM pg_notify('table_update', json_build_object('table', TG_TABLE_NAME, 'id', id, 'type', TG_OP)::text);
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        `;
};

module.exports = functionName => async client => {
    await client.query(sqlCreateFunction(functionName));
};