const express = require('express')
const twitterDB = require('../database/chatQueries')
const router = express.Router()
const chatDb = require('../database/chatQueries')
const userDb = require('../database/userQueries')


router.get('/', async (req, res) => {
    let conversation = await getConversationId(req.body.user.user.username, req.body.username)

    if (typeof conversation != Number) {
        res.send(conversation)
    } else if (conversation === 500) {
        res.sendStatus(500)
    } else if (conversation === 404) {
        res.status(404).send('User does not exist.')
    }
})

// send message
router.post('/', async (req, res) => {
    const conversation = await getConversationId(req.body.user.user.username, req.body.username)

    if (typeof conversation != Number) {
        try {
            let result = await chatDb.sendMessage(req.body.body, conversation.currentUser, conversation.id)
            res.send('Message sent.')
        } catch (e) {
            console.log(e)
            return 500
        }
    } else if (conversation === 500) {
        res.sendStatus(500)
    } else if (conversation === 404) {
        res.status(404).send('User does not exist.')
    }
})

async function getConversationId(usernameA, usernameB) {
    try {
        let userA = await userDb.getOneUserByUsername(usernameA)
        let userB = await userDb.getOneUserByUsername(usernameB)

        if (userA[0] && userB[0]) {
            let conversation = await chatDb.getConversation(userA[0].id, userB[0].id)

            if (!conversation[0]) {
                conversation = await chatDb.createConversation(userA[0].id, userB[0].id)
            }

            conversation[0]["currentUser"] = userA[0].id
            return conversation[0]
        } else {
            return 404
        }
    } catch (e) {
        console.log(e)
        return 500
    }
}


module.exports = router