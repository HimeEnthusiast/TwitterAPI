const express = require('express')
const router = express.Router()
const tweetDb = require('../database/tweetQueries')
const userDb = require('../database/userQueries')


// get all tweets
router.get('/', async (req, res) => {
    try {
        let results = await tweetDb.getAllTweets()
        res.send(results)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweets",
            error: e
        })
    }
})

// get one tweet by id
router.get('/:id', async (req, res) => {
    let result

    try {
        result = await tweetDb.getOneTweet(req.params.id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    if (result) {
        res.send(result)
    } else {
        res.status(404).send({ message: "Tweet does not exist." })
    }
})

//get all tweets by user id

// Post a tweet
router.post('/', async (req, res) => {
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
        tweet = tweetDb.postTweet(req.body.body, user[0].id)
    } catch (e) {
        res.status(500).send({
            message: "Error posting tweet",
            error: e
        })
    }

    try {
        tweetDb.saveUserTweet(user[0].id, tweet.insertId)
    } catch (e) {
        res.status(500).send({
            message: "Error saving tweet to user",
            error: e
        })
    }

    res.send({
        message: 'Tweet posted.',
        tweet: body
    })
})

// Edit tweet
router.put('/', async (req, res) => {
    let tweet

    try {
        userDb.getOneUserByUsername(req.body.user.user.username)
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

    if (tweet[0].userId == user[0].id) {
        tweetDb.updateTweet(req.body.body, tweet[0].id)
    } else {
        res.status(403).send({ message: "Forbidden." })
    }
})

// Delete tweet
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

    if (tweet[0].userId == user[0].id) {
        tweetDb.deleteTweet(tweet[0].id)
        tweetDb.deleteUserTweet(user[0].id, tweet[0].id)
        res.send({ message: "Tweet deleted." })
    } else {
        res.status(403).send({ message: "Forbidden." })
    }
})

router.post('/like', async (req, res) => {
    let user
    let userLikes
    let isLiked = false

    try {
        user = await userDb.getOneUserByUsername(req.body.user.user.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user",
            error: e
        })
    }

    try {
        userLikes = await tweetDb.getUserLikes(user[0].id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user's likes",
            error: e
        })
    }


    if (userLikes) {
        for (i = 0; i < userLikes.length; i++) {
            if (userLikes[i].tweetID === req.body.id) {
                isLiked = true
                break
            }
        }
    }

    if (isLiked) {
        tweetDb.likeTweet(req.body.id, true)
        tweetDb.deleteLike(user[0].id, req.body.id)
        res.send({ message: "Unliked tweet." })
    } else {
        tweetDb.likeTweet(req.body.id, false)
        tweetDb.saveLike(user[0].id, req.body.id)
        res.send({ message: "Liked tweet." })
    }
})

router.post('/retweet', async (req, res) => {
    let user
    let userTweets
    let isRetweeted = false

    try {
        user = await userDb.getOneUserByUsername(req.body.user.user.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user",
            error: e
        })
    }

    try {
        userTweets = await tweetDb.getUserTweets(user[0].id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user",
            error: e
        })
    }

    if (userTweets) {
        for (i = 0; i < userTweets.length; i++) {
            if (userTweets[i].tweetID === req.body.id) {
                isRetweeted = true
                break
            }
        }
    }

    if (isRetweeted) {
        tweetDb.saveUserTweet(user[0].id, req.body.id)
        tweetDb.retweet(req.body.id, true)
        res.send({ message: "Un-Retweeted tweet." })
    } else {
        tweetDb.retweet(req.body.id, false)
        res.send({ message: "Retweeted tweet." })
    }
})

router.post('/reply', async (req, res) => {
    let user
    let reply
    let thread

    try {
        user = await userDb.getOneUserByUsername(req.body.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user",
            error: e
        })
    }

    try {
        reply = await tweetDb.postTweet(req.body.body, user[0].id)
    } catch (e) {
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
        thread = await threadTweets(req.body.parentTweetId, {}, [])
    } catch (e) {
        res.status(500).send({
            message: "Error getting thread",
            error: e
        })
    }

    res.send(thread)
})

async function threadTweets(parentTweetId, thread, replies) {
    let parentTweet
    let replyResults

    try {
        parentTweet = await tweetDb.getOneTweet(parentTweetId)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    try {
        replyResults = await tweetDb.getReplies(parentTweet.id)
    } catch (e) {
        res.status(500).send({
            message: "Error getting replies",
            error: e
        })
    }

    thread.topTweet = parentTweet

    if (replyResults) {
        for (i = 0; i < replyResults.length; i++) {
            let subReplyResults

            try {
                subReplyResults = await tweetDb.getReplies(replyResults[i].id)
            } catch (e) {
                res.status(500).send({
                    message: "Error getting subreplies",
                    error: e
                })
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

module.exports = router