require("dotenv").config();
const sql = require("mysql2");

const pool = sql.createPool({
  connectionLimit: 10,
  host:`${process.env.db_url}`,
  port : `${process.env.DB_PORT}`,
  user: `${process.env.DB_USER}`,
  password : `${process.env.DB_PASSWORD}`,
  database : `${process.env.DB_NAME}`,
  ssl: {
    rejectUnauthorized: true // Ensures the connection is secure
  }
  
})

module.exports = pool;
