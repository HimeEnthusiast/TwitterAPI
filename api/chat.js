const express = require('express')
const router = express.Router()
const chatDb = require('../database/chatQueries')
const userDb = require('../database/userQueries')


router.get('/:username', async (req, res) => {
    let conversationId
    let conversation

    try {
        conversationId = await getConversationId(req.body.user.user.username, req.params.username)
    } catch (e) {
        res.status(500).send({
            message: "Error getting conversation",
            error: e
        })
    }

    if (!('status' in conversationId)) {
        try {
            conversation = await getConversationMessages(conversationId.id)
        } catch (e) {
            res.status(500).send({
                message: conversationId.message,
                error: conversationId.error
            })
        }

        res.send({
            message: "Conversation found",
            convoMessages: conversation.messages
        })
    } else if (conversationId.status === 500) {
        res.status(500).send({
            message: conversationId.message,
            error: conversationId.error
        })
    } else if (conversationId.status === 404) {
        res.status(404).send({
            message: conversationId.message,
            currentUser: req.body.user.user.username,
            targetUser: req.params.username
        })
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
            message: "Error getting conversation (getConversationId)",
            error: e
        })
    }

    if (!('status' in conversation)) {
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
    } else if (conversation.status === 500) {
        res.status(500).send({
            message: "Error getting conversation (conversation status 500)",
            error: e
        })
    } else if (conversation.status === 404) {
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

    if (userA && userB) {
        let conversation

        try {
            conversation = await chatDb.getConversation(userA.id, userB.id)
        } catch (e) {
            return {
                status: 500,
                message: "Error getting conversation (chatDB.getConversation)",
                error: e
            }
        }

        if (!conversation[0]) {
            try {
                conversation = await chatDb.createConversation(userA.id, userB.id)
            } catch (e) {
                return {
                    status: 500,
                    message: "Error creating conversation (chatDB.createConversation)",
                    error: e
                }
            }
        } else {
            conversation[0]["currentUser"] = userA.id
            return conversation[0]
        }
    } else {
        return {
            status: 404,
            message: "Conversation could not be found(getConversationId)"
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
            message: "Conversation messages could not be found (getConversationMessages)"
        }
    }
}

module.exports = {
    router: router,
    getConversationId: getConversationId,
    getConversationMessages: getConversationMessages
}