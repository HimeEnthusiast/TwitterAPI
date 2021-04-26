const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../database/userQueries')

router.post('/login', async (req, res) => {
    const user = {
        "username": req.body.username,
        "password": req.body.password
    }

    try {
        let results = await db.getOneUserByUsername(req.body.username)

        if (!results[0]) {
            res.status(401).send("Account access denied")
        } else {
            if (results[0].password === user.password) {
                jwt.sign({ user: user }, process.env.JWT_SECRET, (err, token) => {
                    res.json({ token })
                })
            } else {
                res.status(401).send("Account access denied")
            }
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router