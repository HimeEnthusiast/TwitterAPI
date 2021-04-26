const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../database/userQueries')

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

    if (!userResult[0]) {
        res.status(401).send({message: "Account access denied"})
    } else {
        if (userResult[0].password === user.password) {
            jwt.sign({ user: user }, process.env.JWT_SECRET, (err, token) => {
                res.json({ token })
            })
        } else {
            res.status(401).send({message: "Account access denied"})
        }
    }
})

module.exports = router