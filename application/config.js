const port = 8888;

const mysql = require('mysql');
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sports'
});

const session_info = {
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}

const enable_profiler = false;

module.exports = { connection, port, session_info, enable_profiler };