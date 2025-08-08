// const mysql = require('mysql');
// require('dotenv').config({path: './.env'});

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// })

// module.exports = db;


const mysql = require('mysql');
require('dotenv').config({ path: './.env' });

let db;

function handleDisconnect() {
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    db.connect((err) => {
        if (err) {
            console.error('Database not connected\n', err);
            setTimeout(handleDisconnect, 2000); // retry in 2 sec
        } else {
            console.log('Database connected');
        }
    });

    db.on('error', (err) => {
        console.error('Database error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_PACKETS_OUT_OF_ORDER') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = db;