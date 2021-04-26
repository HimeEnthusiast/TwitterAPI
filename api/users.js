const express = require('express')
const router = express.Router()
const db = require('../database/userQueries')

router.get('/', (req, res) => {
    res.send("hello")
})

// Register new account
router.post('/', async (req, res) => {
    try {
        // Checking if username is in DB
        let user = await db.getOneUserByUsername(req.body.username)
        if (user[0]) {
            res.status(409).send("Username already taken")
        } else {
            // Create user
            db.insertOneUser(req.body.username, req.body.password)
            res.send("User account created")
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;