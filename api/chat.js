const express = require('express')
const twitterDB = require('../database/chatQueries')
const router = express.Router()
const chatDb = require('../database/chatQueries')
const userDb = require('../database/userQueries')


router.get('/', async (req, res) => {
    let conversationId
    let conversation

    try {
        conversationId = await getConversationId(req.body.user.user.username, req.body.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting conversation",
            error: e
        })
    }

    if (typeof conversationId != Object) {
        if (typeof conversation != Object) {
            try {
                conversation = await getConversationMessages(conversationId.id)
            } catch (e) {
                res.status(500).send({
                    message: "Error getting messages",
                    error: e
                })
            }
            res.send(conversation)
        } else if (conversation === 404) {
            res.status(404).send({ message: "Conversation could not be found" })
        } else if (conversation === 500) {
            res.status(500).send({ message: "Error getting conversation." })
        }
    } else if (conversation === 500) {
        res.status(500).send({ message: "Error getting conversation." })
    } else if (conversation === 404) {
        res.status(404).send({ message: 'User does not exist.' })
    }
})

// send message
router.post('/', async (req, res) => {
    let conversation
    let messages

    try {
        conversation = await getConversationId(req.body.user.user.username, req.body.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting conversation",
            error: e
        })
    }

    if (typeof conversation != Number) {
        try {
            chatDb.sendMessage(req.body.body, conversation.currentUser, conversation.id)
        } catch (e) {
            res.status(500).send({
                message: "Error sending message",
                error: e
            })
        }

        try {
            messages = await getConversationMessages(conversation.id)
        } catch (e) {
            res.status(500).send({
                message: "Error getting messages",
                error: e
            })
        }

        if (messages === 404) {
            messages = "Messages not found"
        } else if (messages === 500) {
            messages = "Error getting messages"
        }

        res.send({
            message: 'Message sent.',
            chat: messages
        })
    } else if (conversation === 500) {
        res.status(500).send({
            message: "Error getting conversation",
            error: e
        })
    } else if (conversation === 404) {
        res.status(404).send('User does not exist.')
    }
})

async function getConversationId(usernameA, usernameB) {
    let userA
    let userB

    try {
        userA = await userDb.getOneUserByUsername(usernameA)
    } catch (e) {
        return {
            status: 500,
            message: "Error getting User",
            error: e
        }
    }

    try {
        userB = await userDb.getOneUserByUsername(usernameB)
    } catch (e) {
        return {
            status: 500,
            message: "Error getting user",
            error: e
        }
    }

    if (userA[0] && userB[0]) {
        let conversation
        try {
            conversation = await chatDb.getConversation(userA[0].id, userB[0].id)
        } catch (e) {
            return {
                status: 500,
                message: "Error getting conversation",
                error: e
            }
        }

        if (!conversation[0]) {
            try {
                conversation = await chatDb.createConversation(userA[0].id, userB[0].id)
            } catch (e) {
                return {
                    status: 500,
                    message: "Error creating conversation",
                    error: e
                }
            }
        } else {
            return {
                status: 404,
                message: "Conversation could not be found"
            }
        }

        conversation[0]["currentUser"] = userA[0].id
        return conversation[0]
    } else {
        return {
            status: 404,
            message: "Conversation could not be found"
        }
    }
}

async function getConversationMessages(conversationId) {
    let messages
    try {
        messages = await chatDb.getConversationMessages(conversationId)
    } catch (e) {
        return {
            status: 500,
            message: "Error getting conversation",
            error: e
        }
    }

    if (messages[0]) {
        return messages
    } else {
        return {
            status: 404,
            message: "Conversation messages could not be found"
        }
    }
}

module.exports = router