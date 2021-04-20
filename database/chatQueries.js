const mysql = require('mysql');

const pool = mysql.createPool({
    user: 'root',
    password: 'root',
    database: 'twitterDB',
    host: 'localhost',
    port: 3306
})

let twitterDB = {}

twitterDB.getConversation = (userAId, userBId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM conversation WHERE (userA_ID = ? AND userB_ID = ?) OR (userA_ID = ? AND userB_ID = ?);', [userAId, userBId, userBId, userAId], (err, results) => {
            if(err) {
                return reject(err)
            }

            return resolve(results)
        }) 
    })
}

twitterDB.createConversation = (userAId, userBId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO conversation (userA_ID, userB_ID) VALUES(?, ?)', [userAId, userBId], (err, results) => {
            if(err) {
                return reject(err)
            }

            return resolve(results)
        }) 
    })
}

twitterDB.sendMessage = (body, userId, convoId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO message (body, date, userID, convoID) VALUES (?, now(), ?, ?)', [body, userId, convoId], (err, results) => {
            if(err) {
                return reject(err)
            }

            return resolve(results)
        }) 
    })
}

twitterDB.getConversationMessages = (convoId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM message WHERE convoID = ?', [convoId], (err, results) => {
            if(err) {
                return reject(err)
            }

            return resolve(results)
        }) 
    })
}

module.exports = twitterDB