/** @module Tweets */
const express = require('express')
const router = express.Router()
const tweetDb = require('../database/tweetQueries')
const userDb = require('../database/userQueries')


/**
 * @function
 * @name GET /tweet/
 * @description Gets all tweets in table.
 * @returns {Object} If successful, will return array of tweets.
 */
router.get('/', async (req, res) => {
    try {
        let tweets = await tweetDb.getAllTweets()
        res.send(tweets)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweets",
            error: e
        })
    }
})

/**
 * @function
 * @name GET /tweet/:id
 * @description Gets 1 tweet by tweet id.
 * @param {Number} id - Tweet id
 * @returns {Object} If successful, will return tweet.
 */
router.get('/:id', async (req, res) => {
    let tweet

    try {
        tweet = await tweetDb.getOneTweet(req.params.id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    if (tweet) {
        res.send(tweet)
    } else {
        res.status(404).send({ message: "Tweet does not exist." })
    }
})

/**
 * @function
 * @name GET /tweet/user/:id
 * @description Gets all tweets and retweets by a user.
 * @param {Number} id - User id
 * @returns {Object} If successful, will return array of tweets.
 */
router.get('/user/:id', async (req, res) => {
    let tweets

    try {
        tweets = await tweetDb.getUserTweetsWithRetweets(req.params.id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    if (tweets[0]) {
        res.send(tweets)
    } else {
        res.status(404).send({ message: "User does not exist or they have no tweets." })
    }
})

/**
 * @function
 * @name POST /tweet/
 * @description Posts a tweet.
 * @param {String} body - Tweet body
 * @returns {Object} If successful, will success message and tweet body.
 */
router.post('/', async (req, res) => {
    let user
    let tweet

    if (req.body.body === null || req.body.body.trim() === '') {
        res.status(400).send({
            message: "Tweet cannot be empty."
        })
        return
    }

    if (req.body.body.length <= 280) { //Tweet must meet character limit
        try {
            user = await userDb.getOneUserByUsername(req.body.user.user.username)
        } catch (e) {
            res.status(500).send({
                message: "Error getting user",
                error: e
            })
        }

        try {
            tweet = await tweetDb.postTweet(req.body.body, user.id)
        } catch (e) {
            res.status(500).send({
                message: "Error posting tweet",
                error: e
            })
        }

        try {
            tweetDb.saveUserTweet(user.id, tweet.insertId)
        } catch (e) {
            res.status(500).send({
                message: "Error saving tweet to user",
                error: e
            })
        }

        res.send({
            message: 'Tweet posted.',
            tweet: req.body.body
        })
    } else {
        res.status(400).send({
            message: "Tweet over character limit (280)",
        })
    }
})

/**
 * @function
 * @name PUT /tweet/
 * @description Updates specified tweet.
 * @param {Number} id - Tweet id
 * @param {String} body - Tweet body
 * @returns {Object} If successful, will return success message and tweet body.
 */
router.put('/', async (req, res) => {
    let tweet
    let user

    try {
        user = await userDb.getOneUserByUsername(req.body.user.user.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user",
            error: e
        })
    }

    try {
        tweet = await tweetDb.getOneTweet(req.body.id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    if (tweet) { // If tweet exists
        if (tweet.userID === user.id) { //Current user has to match user id of tweet being edited
            if (req.body.body.length <= 280) { // Tweet must meet character limit
                tweetDb.updateTweet(req.body.body, tweet.id)
                res.send({
                    message: "Tweet updated.",
                    body: req.body.body
                })
            } else {
                res.status(400).send({
                    message: "Tweet over character limit (280)",
                })
            }
        } else {
            res.status(403).send({ message: "Forbidden." })
        }
    } else {
        res.status(404).send({ message: "Tweet does not exist." })
    }
})

/**
 * @function
 * @name DELETE /tweet/
 * @description Deletes specified tweet
 * @param {Number} id - Tweet id
 * @returns {Object} If successful, will return success message.
 */
router.delete('/', async (req, res) => {
    let user
    let tweet

    try {
        user = await userDb.getOneUserByUsername(req.body.user.user.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user",
            error: e
        })
    }

    try {
        tweet = await tweetDb.getOneTweet(req.body.id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    if (tweet) { // If tweet exists.
        if (tweet.userID === user.id) { // Current user id must match user id of tweet being deleted.
            tweetDb.deleteTweet(tweet.id)
            tweetDb.deleteUserTweet(user.id, tweet.id)
            res.send({ message: "Tweet deleted." })
        } else {
            res.status(403).send({ message: "Forbidden." })
        }
    } else {
        res.status(404).send({ message: "Tweet does not exist" })
    }
})

/**
 * @function
 * @name POST /tweet/like
 * @description Likes specified tweet
 * @param {Number} id - Tweet id
 * @returns {Object} If successful, will return success message.
 */
router.post('/like', async (req, res) => {
    let user
    let userLikes
    let tweet
    let isLiked = false

    try {
        tweet = await tweetDb.getOneTweet(req.body.id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    if (tweet) { // If tweet exists
        try {
            user = await userDb.getOneUserByUsername(req.body.user.user.username)
        } catch (e) {
            res.status(500).send({
                message: "Error getting user",
                error: e
            })
        }

        try {
            userLikes = await tweetDb.getUserLikes(user.id)
        } catch (e) {
            res.status(500).send({
                message: "Error getting user's likes",
                error: e
            })
        }

        // If there are likes, search likes for current tweet
        // If tweet is found, isLiked = true and the loop is broken
        if (userLikes) {
            for (i = 0; i < userLikes.length; i++) {
                if (userLikes[i].tweetID === req.body.id) {
                    isLiked = true
                    break
                }
            }
        }

        if (isLiked) { // Unlike tweet if already liked
            try {
                tweetDb.likeTweet(req.body.id, true)
            } catch (e) {
                res.status(500).send({
                    message: "Error changing tweet likes.",
                    error: e
                })
            }

            try {
                tweetDb.deleteLike(user.id, req.body.id)
            } catch (e) {
                res.status(500).send({
                    message: "Error removing like from table.",
                    error: e
                })
            }

            res.send({ message: "Unliked tweet." })
        } else { // Like tweet if not already liked
            try {
                tweetDb.likeTweet(req.body.id, false)
            } catch (e) {
                res.status(500).send({
                    message: "Error changing tweet likes.",
                    error: e
                })
            }

            try {
                tweetDb.saveLike(user.id, req.body.id)
            } catch (e) {
                res.status(500).send({
                    message: "Error adding like to table.",
                    error: e
                })
            }

            res.send({ message: "Liked tweet." })
        }
    } else {
        res.status(404).send({ message: "Tweet does not exist" })
    }
})

/**
 * @function
 * @name POST /tweet/retweet
 * @description Retweets specified tweet
 * @param {Number} id - Tweet id
 * @returns {Object} If successful, will return success message.
 */
router.post('/retweet', async (req, res) => {
    let user
    let userTweets
    let tweet
    let isRetweeted = false

    try {
        tweet = await tweetDb.getOneTweet(req.body.id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    if (tweet) { // If tweet exists
        try {
            user = await userDb.getOneUserByUsername(req.body.user.user.username)
        } catch (e) {
            res.status(500).send({
                message: "Error getting user",
                error: e
            })
        }

        try {
            userTweets = await tweetDb.getUserTweets(user.id)
        } catch (e) {
            res.status(500).send({
                message: "Error getting user",
                error: e
            })
        }

        // User has tweets, find retweet
        // If found, isRetweeted = true and loop is broken
        if (userTweets) {
            for (i = 0; i < userTweets.length; i++) {
                if (userTweets[i].tweetID === req.body.id) {
                    isRetweeted = true
                    break
                }
            }
        }

        if (isRetweeted) {
            try {
                tweetDb.deleteUserTweet(user.id, req.body.id)
            } catch (e) {
                res.status(500).send({
                    message: "Error removing retweet from table.",
                    error: e
                })
            }

            try {
                tweetDb.retweet(req.body.id, true)
            } catch (e) {
                res.status(500).send({
                    message: "Error changing retweets number.",
                    error: e
                })
            }

            res.send({ message: "Un-Retweeted tweet." })
        } else {
            try {
                tweetDb.saveUserTweet(user.id, req.body.id)
            } catch (e) {
                res.status(500).send({
                    message: "Error saving retweet.",
                    error: e
                })
            }

            try {
                tweetDb.retweet(req.body.id, false)
            } catch (e) {
                res.status(500).send({
                    message: "Error changing retweets number.",
                    error: e
                })
            }

            res.send({ message: "Retweeted tweet." })
        }
    } else {
        res.status(404).send({ message: "Tweet does not exist" })
    }
})

/**
 * @function
 * @name POST /tweet/reply
 * @description Replys to specified tweet
 * @param {Number} parentTweetId - Tweet that is being replied to
 * @param {String} body - Tweet body
 * @returns {Object} If successful, will return thread of tweets.
 */
router.post('/reply', async (req, res) => {
    let user
    let tweet
    let reply
    let thread

    if (req.body.body === null || req.body.body.trim() === '') {
        res.status(400).send({
            message: "Tweet cannot be empty."
        })
        return
    }

    try {
        user = await userDb.getOneUserByUsername(req.body.user.user.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user",
            error: e
        })
    }

    try {
        tweet = await tweetDb.getOneTweet(req.body.parentTweetId)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    if (tweet) { // If parent tweet exists
        if (req.body.body.length <= 280) { // Body must be under character limit
            try {
                reply = await tweetDb.postTweet(req.body.body, user.id)
            } catch (e) {
                console.log("ERROR")
                res.status(500).send({
                    message: "Error posting tweet",
                    error: e
                })
            }

            try {
                tweetDb.reply(req.body.parentTweetId, reply.insertId)
            } catch (e) {
                res.status(500).send({
                    message: "Error posting reply",
                    error: e
                })
            }

            try {
                thread = await threadTweets(req.body.parentTweetId)
            } catch (e) {
                res.status(500).send({
                    message: "Error getting thread",
                    error: e
                })
            }

            if (!('status' in thread)) { // If the thread does not return an error status
                res.send(thread)
            } else if (thread.status === 500) {
                res.status(500).send({
                    message: "Error getting thread",
                    error: thread.error
                })
            } else if (thread.status === 404) {
                res.status(404).send({
                    message: "Tweet does not exist"
                })
            }
        } else {
            res.status(400).send({
                message: "Tweet over character limit (280)",
            })
        }
    } else {
        res.status(404).send({
            message: "Can't reply to tweet that doesn't exist.",
        })
    }
})

/**
 * @function
 * threadTweets
 * @description Creates a thread based on id of top tweet
 * @param {Number} parentTweetId - Top tweet of thread
 * @returns {Object} If successful, will return thread of tweets.
 */
async function threadTweets(parentTweetId) {
    let parentTweet
    let replyResults
    let thread = {}
    let replies = []

    try {
        parentTweet = await tweetDb.getOneTweet(parentTweetId)
    } catch (e) {
        return {
            status: 500,
            message: "Error getting tweet",
            error: e
        }
    }

    if (parentTweet) { // If parent tweet exists
        try {
            replyResults = await tweetDb.getReplies(parentTweet.id)
        } catch (e) {
            return {
                status: 500,
                message: "Error getting replies",
                error: e
            }
        }
    } else {
        return {
            status: 404,
            message: "Tweet does not exist"
        }
    }

    // Set parent tweet as top of thread
    thread.topTweet = parentTweet 

    if (replyResults) { // If tweet has replies
        // Get replies of replies
        for (i = 0; i < replyResults.length; i++) {
            let subReplyResults

            try {
                subReplyResults = await tweetDb.getReplies(replyResults[i].id)
            } catch (e) {
                return {
                    status: 500,
                    message: "Error getting subreplies",
                    error: e
                }
            }
            if (subReplyResults[0]) {
                replyResults[i].replies = subReplyResults
            }
            replies.push(replyResults[i])
        }
        thread.topTweet.replies = replies
    }
    return thread
}

module.exports = {
    router: router,
    threadTweets: threadTweets
}