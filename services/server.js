require("dotenv").config();
const sql = require("mysql2");

const mysql = sql.createConnection(process.env.db_url);

mysql.connect((err) => {
  if (err) return err;
  console.log("connected to database");
});

module.exports = mysql;
