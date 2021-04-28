const express = require('express')
const router = express.Router()
const tweetDb = require('../database/tweetQueries')
const userDb = require('../database/userQueries')


// get all tweets
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

// get one tweet by id
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

//get all tweets by user id
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

    if (tweets) {
        res.send(tweets)
    } else {
        res.status(404).send({ message: "Tweet does not exist." })
    }
})

// Post a tweet
router.post('/', async (req, res) => {
    let user
    let requestUser
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
        requestUser = await userDb.getOneUserByUsername(req.body.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user",
            error: e
        })
    }

    if (user.id === requestUser.id) {
        if (req.body.body.length < 280) {
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
    } else {
        res.status(401).send({ message: "You are not allowed to post to this account." })
    }
})

// Edit tweet
router.put('/', async (req, res) => {
    let tweet
    let user

    try {
        user = userDb.getOneUserByUsername(req.body.user.user.username)
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

    if (tweet) {
        if (tweet.userID === user.id) {
            tweetDb.updateTweet(req.body.body, tweet.id)
            res.send({
                message: "Tweet updated.",
                body: req.body.body
            })
        } else {
            res.status(403).send({ message: "Forbidden." })
        }
    } else {
        res.status(404).send({ message: "Tweet does not exist." })
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

    if (tweet) {
        if (tweet.userID === user[0].id) {
            tweetDb.deleteTweet(tweet.id)
            tweetDb.deleteUserTweet(user[0].id, tweet.id)
            res.send({ message: "Tweet deleted." })
        } else {
            res.status(403).send({ message: "Forbidden." })
        }
    } else {
        res.status(404).send({ message: "Tweet does not exist" })
    }
})

router.post('/like', async (req, res) => {
    let user
    let userLikes
    let tweet
    let isLiked = false

    try {
        tweet = await tweetDb.getOneTweet(req.body.id)
        console.log(tweet)
    } catch (e) {
        res.status(500).send({
            message: "Error getting tweet",
            error: e
        })
    }

    if (tweet) {
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
            tweetDb.deleteLike(user.id, req.body.id)
            res.send({ message: "Unliked tweet." })
        } else {
            tweetDb.likeTweet(req.body.id, false)
            tweetDb.saveLike(user.id, req.body.id)
            res.send({ message: "Liked tweet." })
        }
    } else {
        res.status(404).send({ message: "Tweet does not exist" })
    }
})

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

    if (tweet) {
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

        if (userTweets) {
            for (i = 0; i < userTweets.length; i++) {
                if (userTweets[i].tweetID === req.body.id) {
                    isRetweeted = true
                    break
                }
            }
        }

        if (isRetweeted) {
            tweetDb.deleteUserTweet(user.id, req.body.id)
            tweetDb.retweet(req.body.id, true)
            res.send({ message: "Un-Retweeted tweet." })
        } else {
            tweetDb.saveUserTweet(user.id, req.body.id)
            tweetDb.retweet(req.body.id, false)
            res.send({ message: "Retweeted tweet." })
        }
    } else {
        res.status(404).send({ message: "Tweet does not exist" })
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

module.exports = {
    router: router,
    threadTweets: threadTweets
}