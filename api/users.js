const express = require('express')
const router = express.Router()
const db = require('../database/userQueries')


// Register new account
router.post('/', async (req, res) => {
    let user

    try {
        // Checking if username is in DB
        user = await db.getOneUserByUsername(req.body.username)
    } catch (e) {
        res.status(500).send({ 
            message: "Error getting user",
            error: e 
        })
    }

    if (user[0]) {
        res.status(409).send({ message: "Username already taken" })
    } else {
        try {
            // Create user
            db.insertOneUser(req.body.username, req.body.password)
            res.send({ message: "User account created" })
        } catch (e) {
            res.status(500).send({ 
                message: "User could not be inserted into database",
                error: e
            })
        }
    }
})

module.exports = router;