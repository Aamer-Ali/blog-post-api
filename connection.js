const mysql = require("mysql2");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysqlroot",
  database: "blog-post",
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connection Extablished Successfully");
});

module.exports = connection;
