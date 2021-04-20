const mysql = require('mysql');

const pool = mysql.createPool({
    user: 'root',
    password: 'root',
    database: 'twitterDB',
    host: 'localhost',
    port: 3306
})

let twitterDB = {}

twitterDB.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user', (err, results) => {
            if(err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

twitterDB.getOneUserById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err)
            }

            return resolve(results[0])
        })
    })
}

twitterDB.getOneUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user WHERE username = ? LIMIT 1', [username.toLowerCase()], (err, results) => {
            if(err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

twitterDB.insertOneUser = (username, password) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO user (username, password) VALUES (?, ?)', [username.toLowerCase(), password], (err, results) => {
            if(err) {
                return reject(err)
            }

            return resolve(results[0])
        })
    })
}

module.exports = twitterDB