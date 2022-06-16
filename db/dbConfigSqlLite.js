
const knexSqlite3 = require('knex')({
    client: 'sqlite3', // or 'better-sqlite3'
    connection: {
      filename: "./db/ecommerce.sqlite"
    },
    useNullAsDefault: true
});

module.exports =  knexSqlite3;