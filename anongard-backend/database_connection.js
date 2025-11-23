require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err){
        console.log('Error con la conexion a la Base de Datos ', err);
        return;
    } else {
        console.log('Conexion realizada exitosamente');
        connection.release();
    }
});

module.exports = pool.promise()