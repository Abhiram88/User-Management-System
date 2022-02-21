var mysql = require('mysql2');

var con = mysql.createConnection({
    //connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    database: 'socialnetworking',
    password: "admin"
  });

  module.exports = con;