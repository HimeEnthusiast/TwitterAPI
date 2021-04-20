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
            res.status(404).send({message: "Tweet does not exist."})
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

// Post a tweet
router.post('/', async (req, res) => {
    const body = req.body.body

    try {
        let userId = await userDb.getOneUserByUsername(req.body.user.user.username)
        let results = await tweetDb.postTweet(body, userId[0].id)

        res.json({
            message: 'Tweet posted.',
            tweet: body
        })
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router