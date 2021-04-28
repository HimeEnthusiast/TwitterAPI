const mysql = require('mysql');

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
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

twitterDB.getUserLikes = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user_likes WHERE userId = ?', [userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.postTweet = (body, userId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO tweet (body, likes, userId, date) VALUES (?, 0, ?, now())', [body, userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.saveUserTweet = (userId, tweetId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO user_tweets VALUES (?, ?)', [userId, tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.retweet = (tweetId, isRetweeted) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE tweet SET retweets = retweets' + ((isRetweeted) ? ' - 1 ' : ' + 1 ') + 'WHERE id = ?', [tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.deleteUserTweet = (userId, tweetId) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM user_tweets WHERE userID = ? AND tweetID = ?', [userId, tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.getUserTweets = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user_tweets WHERE userId = ?', [userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.getUserTweetsWithRetweets = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT tweet.id, tweet.body, tweet.likes, tweet.retweets, tweet.date, tweet.userID FROM tweet JOIN user_tweets ON tweet.id = user_tweets.tweetID WHERE user_tweets.userID = ?', [userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.updateTweet = (body, tweetId) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE tweet SET body = ? WHERE id = ?', [body, tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.deleteTweet = (tweetId) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM tweet WHERE id = ?', [tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.likeTweet = (tweetId, isLiked) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE tweet SET likes = likes' + ((isLiked) ? ' - 1 ' : ' + 1 ') + 'WHERE id = ?', [tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.saveLike = (userId, tweetId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO user_likes VALUES (?, ?)', [userId, tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.deleteLike = (userId, tweetId) => {//delete from userlikes where userid = ? AND tweetId = ?
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM user_likes WHERE userID = ? AND tweetID = ?', [userId, tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.getLastTweetIdTest = () => { //testhing method
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM tweet ORDER BY ID DESC LIMIT 1', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0])
        })
    })
}

twitterDB.reply = (tweetId, replyId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO tweet_replies VALUES (?, ?)', [tweetId, replyId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

twitterDB.getReplies = (tweetId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT tweet.id, tweet.body, tweet.likes, tweet.userID, tweet.date FROM tweet JOIN tweet_replies ON tweet.id = tweet_replies.replyID WHERE tweet_replies.tweetID = ? ORDER BY tweet.id;', [tweetId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

module.exports = twitterDB