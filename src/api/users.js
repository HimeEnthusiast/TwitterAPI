/** @module Users */
const express = require('express')
const router = express.Router()
const db = require('../database/userQueries')


/**
 * @function
 * @name POST /users/
 * @description Registers a new user in the database.
 * @param {String} username
 * @param {String} password
 */
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

    if (user) {
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