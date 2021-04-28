const mysql = require('mysql');

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
})

/** @module TweetQueries */
let twitterDB = {}

/**
 * @function
 * getAllTweets
 * @description - Gets all tweets from the tweet table.
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * getOneTweet
 * @description - Gets 1 tweet from the tweet table based on tweet id.
 * @param {Number} tweetId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * getUserLikes
 * @description - Gets ids for all tweets that a user has liked.
 * @param {Number} userId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * postTweet
 * @description - Posts a new tweet to the tweet table with tweet body and user id of the author.
 * @param {String} body - Tweet body (280 characters maximum)
 * @param {String} userId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
twitterDB.postTweet = (body, userId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO tweet (body, likes, retweets, userId, date) VALUES (?, 0, 0, ?, now())', [body, userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/**
 * @function
 * saveUserTweet
 * @description - Saves id of both tweets written by a user, as well as tweets retweeted by a user. 
 * @param {Number} userId 
 * @param {Number} tweetId 
 * @returns {Promise} - Resolve sql response or reject with error message
 */
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

/**
 * @function
 * retweet
 * @description - Increases or decreases retweet count of a tweet.
 * @param {Number} tweetId 
 * @param {Boolean} isRetweeted - Determines if retweeted or undoing a retweet.
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * deleteUserTweet
 * @description - Removes a tweet from the user_tweets table.
 * @param {Number} userId 
 * @param {Number} tweetId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * getUserTweets
 * @description - Gets all tweets posted by a user, based on user id.
 * @param {Number} userId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * getUserTweetsWithRetweets
 * @description - Gets full tweet data from the user_tweets table based on user id. 
 * @param {Number} userId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * updateTweet
 * @description - Updates an existing tweet body.
 * @param {String} body - Tweet body (280 characters maximum)
 * @param {Number} tweetId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * deleteTweet
 * @description - Deletes an existing tweet.
 * @param {Number} tweetId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * likeTweet
 * @description - Increases or decreases the like count on a tweet.
 * @param {Number} tweetId 
 * @param {Boolean} isLiked - Determines if a tweet is being liked or unliked.
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * saveLike
 * @description - Inserts a user id and tweet id into the user_likes table.
 * @param {Number} userId 
 * @param {Number} tweetId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * deleteLike
 * @description - Deletes a row from user_likes based on a combination of user id and tweet id.
 * @param {Number} userId 
 * @param {Number} tweetId 
 * @returns {Promise} - Resolve sql response or reject with error message.
 */
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

/**
 * @function
 * getLastTweetIdTest
 * @description - Gets last posted tweet in table. Used in testing only. 
 * @returns {Promise} - Resolve sql response or reject with error message
 */
twitterDB.getLastTweetIdTest = () => { //testing method
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM tweet ORDER BY ID DESC LIMIT 1', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0])
        })
    })
}

/**
 * @function
 * reply
 * @description - Links tweet id of a reply to the parent tweet.
 * @param {Number} tweetId 
 * @param {Number} replyId 
 * @returns {Promise} - Resolve sql response or reject with error message
 */
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

/**
 * @function
 * getReplies
 * @description - Gets all tweet tweet data of replies to the tweet id specified.
 * @param {Number} tweetId 
 * @returns {Promise} - Resolve sql response or reject with error message
 */
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