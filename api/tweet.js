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

//get all tweets by user id

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

// Edit tweet
router.put('/', async (req, res) => {
    try {
        //get tweet id
        //check if tweet belongs to user
        //update tweet or error
    } catch (e) {

    }
})

// Delete tweet
router.delete('/', async (req, res) => {
    try {
        //get tweet id
        //check if tweet belongs to user
        //delete tweet or error
    } catch (e) {

    }
})

router.post('/like', async (req, res) => {
    try {
        //check if user has liked tweet
        //if liked send true else send false 
    } catch (e) {

    }
})

router.post('/retweet', async (req, res) => {
    try {
        //get user id
        //get tweet id
        //add to user_tweets table
    } catch (e) {

    }
})

router.post('/reply', async (req, res) => {
    try {
        //get parent tweet id
        //add to tweet_replies table
    } catch (e) {

    }
})

module.exports = router