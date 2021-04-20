const mysql = require('mysql');

const pool = mysql.createPool({
    user: 'root',
    password: 'root',
    database: 'twitterDB',
    host: 'localhost',
    port: 3306
})

let twitterDB = {}

twitterDB.getAllTweets = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM tweet', (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

twitterDB.getOneTweet = (tweetId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM tweet WHERE id = ?', [tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results[0])
        })
    })
}

twitterDB.postTweet = (body, userId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO tweet (body, likes, userId, date) VALUES (?, 0, ?, now())', [body, userId], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results[0])
        })
    })
}

twitterDB.updateTweet = (body, tweetId) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE tweet SET body = ? WHERE id = ?', [body, tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results[0])
        })
    })
}

twitterDB.deleteTweet = (tweetId) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM tweet WHERE id = ?', [tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results[0])
        })
    })
}

twitterDB.likeTweet = (tweetId, isLiked) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE tweet SET likes = likes' + ((isLiked) ? ' - 1 ' : ' + 1 ') + 'WHERE id = ?', [tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results[0])
        })
    })
}

twitterDB.retweet = (id, userId) => {

}

twitterDB.reply = (Id, body, userId) => {

}

module.exports = twitterDB