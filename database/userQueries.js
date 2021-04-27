const mysql = require('mysql');

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
})

let twitterDB = {}

twitterDB.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.getOneUserById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user WHERE id = ?', [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0])
        })
    })
}

twitterDB.getOneUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user WHERE username = ?', [username.toLowerCase()], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0])
        })
    })
}

twitterDB.insertOneUser = (username, password) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO user (username, password) VALUES (?, ?)', [username.toLowerCase(), password], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

module.exports = twitterDB