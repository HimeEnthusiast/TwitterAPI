const app = require('../../main')
const chat = require('../../src/api/chat')
const request = require('supertest')
const randromstr = require('randomstring')


describe('[POST]', () => {
    it('POST[/chat/] user exists, sends message to user, should return 200', async () => {
        await request(app)
            .post('/chat/')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                username: "user",
                body: "hey bestie <3"
            })
            .expect(200)
    })

    it('POST[/chat/] user does not exist, should return 404', async () => {
        await request(app)
            .post('/chat/')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                username: randromstr.generate(10),
                body: "hey bestie <3"
            })
            .expect(404)
    })

    it('POST[/chat/] jwt invalid, shoul return 401', async () => {
        await request(app)
            .post('/chat/')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'gfgfdgfgfd')
            .send({
                username: "user",
                body: "hey bestie <3"
            })
            .expect(401)
    })
})

describe('[GET]', () => {
    it('GET[/chat/:username] conversation found and jwt valid, should return 200', async () => {
        await request(app)
            .get('/chat/user')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .expect(200)
    })

    it('GET[/chat/:username] jwt not valid, should return 401', async () => {
        await request(app)
            .get('/chat/user')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'ggfdgfdgdfgdf')
            .expect(401)
    })

    it('GET[/chat/:username] user does not exist, should return 404', async () => {
        await request(app)
            .get('/chat/fgfdgfdgfd')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .expect(404)
    })
})

describe('[getConversationMessages]', () => {
    it('[getConversationMessages] conversation exists, shoudl return an array', async () => {
        let result = await chat.getConversationMessages(1)
        expect(result instanceof Array).toBeTruthy()
    })

    it('[getConversationMessages] conversation does not exist, should return 404', async () => {
        let result = await chat.getConversationMessages(4234324432)
        expect(result.status == 404).toBeTruthy()
    })
})

describe('[getConversationId]', () => {
    it('[getConversationId] both users exist with conversation, should return conversation', async () => {
        let result = await chat.getConversationId('user', 'testuser')
        expect(result.id).toBeTruthy()
    })

    it('[getConversationId] both users exist with conversation, should return conversation', async () => {
        let result = await chat.getConversationId('rtretre', 'testuser')
        expect(result.status === 404).toBeTruthy()
    })
})