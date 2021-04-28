/** @module Jwt */
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../database/userQueries')

/**
 * @function
 * @name POST /jwt/
 * @description Performs user login by determining if credentials exist and are valid.
 * @param {String} username
 * @param {String} password
 * @returns {String} Returns JWT token.
 */
router.post('/login', async (req, res) => {
    let userResult
    const user = {
        "username": req.body.username,
        "password": req.body.password
    }

    try {
        userResult = await db.getOneUserByUsername(req.body.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting user",
            error: e
        })
    }

    if (!userResult) {
        res.status(401).send({message: "Account access denied"})
    } else {
        if (userResult.password === user.password) {
            jwt.sign({ user: user }, process.env.JWT_SECRET, (err, token) => {
                res.json({ token })
            })
        } else {
            res.status(401).send({message: "Account access denied"})
        }
    }
})

module.exports = router