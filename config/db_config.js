const mysql = require("mysql2");
const db_config = require("./db_config.json");

var conn = mysql.createConnection({
  host: db_config.host,
  user: db_config.username,
  password: db_config.password,
  database: db_config.database,
  multipleStatements: true,
  timezone: "+09:00",
});

conn.connect();

module.exports = conn;
