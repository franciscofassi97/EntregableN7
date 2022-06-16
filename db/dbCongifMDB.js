
const knexMysql = require('knex')({
    client: 'mysql', // or 'better-sqlite3'
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : 'root',
        password : '123456',
        database : 'entregableN7'
      }
});

module.exports =  knexMysql;