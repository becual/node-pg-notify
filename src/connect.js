const { Client } = require('pg');
const chalk = require('chalk');

const client = new Client({
    host: '127.0.0.1',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
});


module.exports = () => {
    return client.connect()
        .then(() => {
            console.log(chalk.green(`=> Connected to ${process.env.POSTGRES_HOST}`));
            return client;
        })
        .catch(err => console.log(chalk.red(`=> Error ${err}`)));
};

