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
function connectToDatabase() {
  connection = mysql.createConnection(db_config);

  connection.connect((err) => {
    if (err) {
      
      console.error('Error connecting to MySQL:', err);
      setTimeout(connectToDatabase, 2000); // Retry after 2 seconds
    } else {
      console.log('Connected to MySQL cloud database.');
    }
  });

  // Handle connection errors and reconnection
  connection.on('error', (err) => {
    console.error('MySQL Error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
      console.error('MySQL connection lost, reconnecting...');
      connectToDatabase();  // Reconnect on connection loss
    } else {
      throw err;
    }
  });
}

// Initialize connection
connectToDatabase();

module.exports = connection;
