/** @module User */
const express = require('express')
const router = express.Router()
const db = require('../database/userQueries')
const bcrypt = require('bcryptjs')


/**
 * @function
 * @name POST /user/
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
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(req.body.password, salt)
        db.insertOneUser(req.body.username, hash)
            .then((result) => {
                res.send({message: "User account created"})
            })
            .catch((err) => {
                res.status(500).send({ 
                    message: "Error saving user",
                    error: err
                })
            })
    }
})

module.exports = router;