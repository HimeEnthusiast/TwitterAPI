const mysql = require('mysql');

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
})

/** @module UserQueries */
let twitterDB = {}

/**
 * getAllUsers
 * @description - Gets all users in database.
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * getOneUserById
 * @description - Searches for one user based on user id.
 * @param {Number} id 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * getOneUserByUsername
 * @description - Searches for one user based on user name.
 * @param {String} username 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * insertOneUser
 * @description - Creates a new user account with username and password.
 * @param {String} username 
 * @param {String} password 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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