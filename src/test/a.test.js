const connect = require('../connect');

test('Some test', async () => {        
    const db = await connect();

    const result = await db.query('SELECT NOW()');

    console.info(result);

    expect(true).toBe(true);
    
});