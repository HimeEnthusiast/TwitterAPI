const mysql = require('mysql');
const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
})

/** @module ChatQueries */
let chatQueries = {}

/**
 * @function
 * getConversation
 * @description - Gets the conversation between the 2 user ids specified.
 * @param {Number} userAId 
 * @param {Number} userBId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
chatQueries.getConversation = (userAId, userBId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM conversation WHERE (userA_ID = ? AND userB_ID = ?) OR (userA_ID = ? AND userB_ID = ?)', [userAId, userBId, userBId, userAId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/**
 * @function
 * createConversation
 * @description - Creates a new conversation between the 2 users specified.
 * @param {Number} userAId 
 * @param {Number} userBId 
 * @returns {Promise} - Resolve sql response or reject with error message
 */
chatQueries.createConversation = (userAId, userBId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO conversation (userA_ID, userB_ID) VALUES(?, ?)', [userAId, userBId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/**
 * @function
 * sendMessage
 * @description - Adds a message to a conversation with message body, author id, and conversation id.
 * @param {String} body - Message body
 * @param {Number} userId - Message author
 * @param {Number} convoId - Conversation id that message belongs to
 * @returns {Promise} - Resolve sql response or reject with error message
 */
chatQueries.sendMessage = (body, userId, convoId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO message (body, date, userID, convoID) VALUES (?, now(), ?, ?)', [body, userId, convoId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/**
 * @function
 * getConversationMessages
 * @description - Gets all messages from a conversation in order of datetime sent.
 * @param {Number} convoId 
 * @returns {Promise} - Resolve sql response or reject with error message
 */
chatQueries.getConversationMessages = (convoId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT message.id, message.body, message.date, user.username FROM message JOIN user ON message.userID = user.id WHERE convoID = ? ORDER BY message.date', [convoId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}


module.exports = chatQueries