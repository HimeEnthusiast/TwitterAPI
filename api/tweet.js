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
        console.log(e)
        res.sendStatus(500)
    }
})

// get one tweet by id
router.get('/:id', async (req, res) => {
    try {
        let result = await tweetDb.getOneTweet(req.params.id)

        if (result) {
            res.send(result)
        } else {
            res.status(404).send({ message: "Tweet does not exist." })
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

//get all tweets by user id

// Post a tweet
router.post('/', async (req, res) => {
    const body = req.body.body

    try {
        let user = await userDb.getOneUserByUsername(req.body.user.user.username)
        let tweet = await tweetDb.postTweet(body, user[0].id)
        let saveTweet = await tweetDb.saveUserTweet(user[0].id, tweet.insertId)

        res.json({
            message: 'Tweet posted.',
            tweet: body
        })
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

// Edit tweet
router.put('/', async (req, res) => {
    try {
        let user = await userDb.getOneUserByUsername(req.body.user.user.username)
        let tweet = await tweetDb.getOneTweet(req.body.id)

        if (tweet[0].userId == user[0].id) {
            tweetDb.updateTweet(req.body.body, tweet[0].id)
        } else {
            res.status(403).send({ message: "Forbidden." })
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

// Delete tweet
router.delete('/', async (req, res) => {
    try {
        let user = await userDb.getOneUserByUsername(req.body.user.user.username)
        let tweet = await tweetDb.getOneTweet(req.body.id)

        if (tweet[0].userId == user[0].id) {
            let deleteTweetResult = await tweetDb.deleteTweet(tweet[0].id)
            let deleteUserTweetsResult = await tweetDb.deleteUserTweet(user[0].id, tweet[0].id)
            res.send({ message: "Tweet deleted." })
        } else {
            res.status(403).send({ message: "Forbidden." })
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/like', async (req, res) => {
    try {
        let user = await userDb.getOneUserByUsername(req.body.user.user.username)
        let userLikes = await tweetDb.getUserLikes(user[0].id)
        let isLiked = false

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
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/retweet', async (req, res) => {
    try {
        let user = await userDb.getOneUserByUsername(req.body.user.user.username)
        let userTweets = await tweetDb.getUserTweets(user[0].id)
        let isRetweeted = false

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
            res.send({ message: "Un-Retweeted tweet." })
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/reply', async (req, res) => {
    try {
        let user = await userDb.getOneUserByUsername(req.body.username)
        let reply = await tweetDb.postTweet(req.body.body, user[0].id)
        tweetDb.reply(req.body.parentTweetId, reply.insertId)
        res.send(await threadTweets(req.body.parentTweetId, {}, []))
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

async function threadTweets(parentTweetId, thread, replies) {
    let parentTweet = await tweetDb.getOneTweet(parentTweetId)
    let replyResults = await tweetDb.getReplies(parentTweet.id)
    thread.topTweet = parentTweet

    if (replyResults) {
        thread.topTweet = parentTweet
        for (i = 0; i < replyResults.length; i++) {
            let subReplyResults = await tweetDb.getReplies(replyResults[i].id)
            if (subReplyResults[0]) {
                replyResults[i].replies = subReplyResults
            }
            replies.push(replyResults[i])
        }
        thread.topTweet.replies = replies

    } else {
        thread.topTweet = parentTweet
    }

    return thread
}

module.exports = router