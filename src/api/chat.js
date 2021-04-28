/** @module Chat */
const express = require('express')
const router = express.Router()
const chatDb = require('../database/chatQueries')
const userDb = require('../database/userQueries')

/**
 * @function
 * @name GET /chat/:username
 * @description Gets conversation between current logged in user and specified user
 * @param {String} username - Recipient user
 * @returns {Object} If successful, will return success message and array of messages in conversation.
 */
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

    if (conversationId) {
        if (!('status' in conversationId)) { // If conversationId object doesn't return a status code
            try {
                conversation = getConversationMessages(conversationId.id)
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
        } else if (conversationId.status === 400) {
            res.status(400).send({
                message: conversationId.message,
                currentUser: req.body.user.user.username,
                targetUser: req.params.username
            })
        }
    } else {
        res.send({})
    }
})

/**
 * @function
 * @name POST /chat/
 * @description Sends a message in conversation between current logged in user and specified user
 * @param {String} username - Recipient user
 * @param {String} body - Message body
 * @returns {Object} If successful, will return message.
 */
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
            user: req.body.user.user.username,
            message: req.body.body
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

/**
 * @function
 * getConversationId
 * @description Gets a conversation object for users specified from the database.
 * @param {String} usernameA 
 * @param {String} usernameB 
 * @returns {Object} Returns a conversation object from the database or return an error object with status code.
 */
async function getConversationId(usernameA, usernameB) {
    let userA
    let userB

    try {
        userA = await userDb.getOneUserByUsername(usernameA)
    } catch (e) {
        return {
            status: 500,
            message: "Error getting User (userA)",
            error: e
        }
    }

    try {
        userB = await userDb.getOneUserByUsername(usernameB)
    } catch (e) {
        return {
            status: 500,
            message: "Error getting user (userB)",
            error: e
        }
    }

    if (userA && userB) { // If both users exist
        if (userA.id == userB.id) {
            return {
                status: 400,
                message: "You cannot create a conversation with yourself."
            }
        } else {
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

            if (!conversation[0]) { // If conversation doesn't exist, create a new one.
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
        }
    } else {
        return {
            status: 404,
            message: "Conversation could not be found (getConversationId)"
        }
    }
}

/**
 * @function
 * getConversationMessages
 * @description Gets all messages that belong to a conversation.
 * @param {Number} conversationId 
 * @returns {Array} Returns array of messages or error object.
 */
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