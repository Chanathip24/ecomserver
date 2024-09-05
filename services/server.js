require("dotenv").config();
const mysql = require("mysql2");

let connection;
var db_config = {
  host: process.env.db_url,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true, // Ensures the connection is secure
  },
  enableKeepAlive: true, // Keeps the connection alive
  connectTimeout: 10000,
}
connection = mysql.createPool({
  host: process.env.db_url,
  port : process.env.DB_PORT,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  ssl:{
    rejectUnauthorized : true
  },
  connectTimeout : 10000
})
connection.on('error',(err)=>{
  console.log(err)
})

module.exports = connection;
