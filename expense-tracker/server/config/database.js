const mysql = require('mysql2');

require('dotenv').config();

// Create connection
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'expense_tracker_db'
    }
);

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});


module.exports = db;