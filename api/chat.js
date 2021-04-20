const express = require('express')
const twitterDB = require('../database/chatQueries')
const router = express.Router()
const chatDb = require('../database/chatQueries')
const userDb = require('../database/userQueries')


//create message with convo id
router.get('/', async (req, res) => {
    let convo = await getConvoId(req.body.user.user.username, req.body.username)
    
    if(typeof convo != Number) {
        res.send(convo)
    } else if (convo === 500) {
        res.sendStatus(500)
    } else if (convo === 404) {
        res.status(404).send('User does not exist.')
    }
})

// send message
router.post('/', async (req, res) => {
    const convo = await getConvoId(req.body.user.user.username, req.body.username)
    
    if(typeof convo != Number) {
        try {
            let result = await chatDb.sendMessage(req.body.body, convo.currentUser, convo.id)
            res.send('Message sent.')                                                                                                                                                 
        } catch(e) {
            console.log(e)
            return 500
        }
    } else if (convo === 500) {
        res.sendStatus(500)
    } else if (convo === 404) {
        res.status(404).send('User does not exist.')
    }
})

async function getConvoId(usernameA, usernameB) {
    try {
        let userA = await userDb.getOneUserByUsername(usernameA)
        let userB = await userDb.getOneUserByUsername(usernameB)

        if(userA[0] && userB[0]) {
            let convo = await chatDb.getConversation(userA[0].id, userB[0].id)

            if(!convo[0]) {
                convo = await chatDb.createConversation(userA[0].id, userB[0].id)
            }

            convo[0]["currentUser"] = userA[0].id
            return convo[0]
        } else {
            return 404
        }
    } catch (e) {
        console.log(e)
        return 500
    }
}


module.exports = router