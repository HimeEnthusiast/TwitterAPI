const app = require('../../main')
const tweet = require('../../src/api/tweet')
const tweetQueries = require('../../src/database/tweetQueries')
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
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                body: randromstr.generate(50)
            })
            .expect(200)
    })

    it('POST[/tweet/] jwt is not valid, should return 401', async () => {
        await request(app)
            .post('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'gfdgdfgdfg')
            .send({
                body: randromstr.generate(50)
            })
            .expect(401)
    })

    it('POST[/tweet/] body is overlimit, should return 400', async () => {
        await request(app)
            .post('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
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
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: 1
            })
            .expect(200)
    })

    it('POST[/tweet/like] tweet is not found, should return 404', async () => {
        await request(app)
            .post('/tweet/like')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: 453454353345
            })
            .expect(404)
    })


    it('POST[/tweet/retweet] tweet is found, is retweeted/unretweeted, should return 200', async () => {
        await request(app)
            .post('/tweet/retweet')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: 1
            })
            .expect(200)
    })

    it('POST[/tweet/retweet] tweet is not found, should return 404', async () => {
        await request(app)
            .post('/tweet/retweet')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: 65656554645464
            })
            .expect(404)
    })


    it('POST[/tweet/reply] tweet id and body is valid, should return 200', async () => {
        await request(app)
            .post('/tweet/reply')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                parentTweetId: 1,
                body: randromstr.generate(50)
            })
            .expect(200)
    })

    it('POST[/tweet/reply] reply over character limit, should return 400', async () => {
        await request(app)
            .post('/tweet/reply')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                parentTweetId: 1,
                body: randromstr.generate(300)
            })
            .expect(400)
    })

    it('POST[/tweet/reply] parent id not found, should return 404', async () => {
        await request(app)
            .post('/tweet/reply')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                parentTweetId: 43654365,
                body: randromstr.generate(50)
            })
            .expect(404)
    })
})

describe('[PUT]', () => {
    it('PUT[/tweet/] jwt and tweet id dont match, should return 403', async () => {
        await request(app)
            .put('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: 1,
                body: randromstr.generate(50)
            })
            .expect(200)
    })

    it('PUT[/tweet/] jwt and tweet id dont match, should return 403', async () => {
        await request(app)
            .put('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: 2,
                body: randromstr.generate(50)
            })
            .expect(403)
    })

    it('PUT[/tweet/] characters over limit, should return 400', async () => {
        await request(app)
            .put('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: 1,
                body: randromstr.generate(300)
            })
            .expect(400)
    })
})

describe('[DELETE]', () => {
    it('DELETE[/tweet/] row matches user, is deleted', async () => {
        let row = await tweetQueries.getLastTweetIdTest()

        await request(app)
            .delete('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: row.id
            })
            .expect(200)
    })

    it('DELETE[/tweet/] tweet does not exist, should return 404', async () => {
        await request(app)
            .delete('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: 6546546546465
            })
            .expect(404)
    })

    it('DELETE[/tweet/] tweet does not belong to user, should return 403', async () => {
        await request(app)
            .delete('/tweet/')
            .set('Content-Type', 'application/json')
            .set('Authorization', process.env.TESTING_TOKEN)
            .send({
                id: 2
            })
            .expect(403)
    })
})

describe('[threadTweets]', () => {
    it('[threadTweets]', async () => {
        let result = await tweet.threadTweets(1)
        expect(result instanceof Object).toBeTruthy()
    })

    it('[threadTweets]', async () => {
        let result = await tweet.threadTweets(54354354)
        expect(result instanceof Object).toBeTruthy()
    })
})