const sqlCreateFunction = (channel, schema, fn) => {
    return `
        CREATE OR REPLACE FUNCTION ${schema}.${fn}() RETURNS trigger AS $$
        DECLARE
          data json;
          notification json;
        BEGIN

          IF (TG_OP = 'DELETE') THEN
            data = row_to_json(OLD);
          ELSE
            data = row_to_json(NEW);
          END IF;

          notification = json_build_object(
            'type', TG_OP,
            'dateTime', clock_timestamp(),
            'table', TG_TABLE_NAME::text,
            'schema', TG_TABLE_SCHEMA::text,
            'data', data
          );

          PERFORM pg_notify('${channel}', notification::text);
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
        `;
};

module.exports = (channel, schema, functionName) => async client => {
    await client.query(sqlCreateFunction(channel, schema, functionName));
};