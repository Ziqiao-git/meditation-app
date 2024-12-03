const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',      // Database host name
  user: 'root',   // Database user
  password: '005078xzq', // Database password
  database: 'med-app-dev'  // Database name
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    return console.error('error connecting: ' + err.stack);
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;