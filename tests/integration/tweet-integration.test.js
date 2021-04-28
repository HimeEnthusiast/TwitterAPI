const app = require('../../main')
const tweet = require('../../api/tweet')
const request = require('supertest')
const randromstr = require('randomstring')

describe('[GET]', () => {
    it('GET[/tweet/] get all tweets, should return 200', async () => {
        await request(app)
            .get('/tweet/')
            .set('Content-Type', 'application/json')
            .expect(200)
    })

    it('GET[/tweet/:id] tweet id exists, should return 200', async () => {
        await request(app)
            .get('/tweet/1')
            .set('Content-Type', 'application/json')
            .expect(200)
    })


    it('GET[/tweet/:id] tweet id does not exist, should return 404', async () => {
        await request(app)
            .get('/tweet/4324324543')
            .set('Content-Type', 'application/json')
            .expect(404)
    })

    it('GET[/tweet/user/:id] user id exists, should return 200', async () => {
        await request(app)
            .get('/tweet/user/1')
            .set('Content-Type', 'application/json')
            .expect(200)
    })

    it('GET[/tweet/:id] user id does not exist, should return 404', async () => {
        await request(app)
            .get('/tweet/654654645')
            .set('Content-Type', 'application/json')
            .expect(404)
    })
})


describe('[POST]', () => {
    it('POST[/tweet/] jwt is valid and body is within limit, should return 200', async () => {
        await request(app)
            .post('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoicGFzcyJ9LCJpYXQiOjE2MTk1NzQxMjF9.xN5VNs8ZQeKJYjqhT5z09C-sebialkVSVeWk0ieBT5U')
            .send({
                username: 'user',
                body: randromstr.generate(50)
            })
            .expect(200)
    })

    it('POST[/tweet/] jwt is not valid, should return 401', async () => {
        await request(app)
            .post('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer eyJhbG//////ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoicGFzcyJ9LCJpYXQiOjE2MTk0ODY3ODl9.koExWUewJCU3R39rGG9aGloiVFxREKq0gMPVI6rlSIc')
            .send({
                username: 'user',
                body: randromstr.generate(50)
            })
            .expect(401)
    })

    it('POST[/tweet/] body is overlimit, should return 400', async () => {
        await request(app)
            .post('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoicGFzcyJ9LCJpYXQiOjE2MTk0ODY3ODl9.koExWUewJCU3R39rGG9aGloiVFxREKq0gMPVI6rlSIc')
            .send({
                username: 'user',
                body: randromstr.generate(300)
            })
            .expect(400)
    })

    it('POST[/tweet/like] tweet is found, is liked/unliked, should return 200', async () => {
        await request(app)
            .post('/tweet/like')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoicGFzcyJ9LCJpYXQiOjE2MTk0ODY3ODl9.koExWUewJCU3R39rGG9aGloiVFxREKq0gMPVI6rlSIc')
            .send({
                id: 1
            })
            .expect(200)
    })

    it('POST[/tweet/like] tweet is not found, should return 404', async () => {
        await request(app)
            .post('/tweet/like')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoicGFzcyJ9LCJpYXQiOjE2MTk0ODY3ODl9.koExWUewJCU3R39rGG9aGloiVFxREKq0gMPVI6rlSIc')
            .send({
                id: 453454353345
            })
            .expect(404)
    })

    
    it('POST[/tweet/retweet] tweet is found, is retweeted/unretweeted, should return 200', async () => {
        await request(app)
            .post('/tweet/retweet')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoicGFzcyJ9LCJpYXQiOjE2MTk0ODY3ODl9.koExWUewJCU3R39rGG9aGloiVFxREKq0gMPVI6rlSIc')
            .send({
                id: 1
            })
            .expect(200)
    })

    it('POST[/tweet/retweet] tweet is not found, should return 404', async () => {
        await request(app)
            .post('/tweet/retweet')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoicGFzcyJ9LCJpYXQiOjE2MTk0ODY3ODl9.koExWUewJCU3R39rGG9aGloiVFxREKq0gMPVI6rlSIc')
            .send({
                id: 65656554645464
            })
            .expect(404)
    })
})

describe('[PUT]', () => {
    
})

describe('[DELETE]', () => {
    
})

describe('[threadTweets]', () => {
    
})