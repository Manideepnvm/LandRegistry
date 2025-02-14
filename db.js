const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'M@nideep@09', // Replace with your MySQL password
    database: 'land_registration',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to MySQL database!");
        connection.release(); // Release the connection back to the pool
    }
});

module.exports = pool.promise();
