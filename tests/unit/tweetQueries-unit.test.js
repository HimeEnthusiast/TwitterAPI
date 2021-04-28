const app = require('../../main')
const request = require('supertest')
const tweetQueries = require('../../src/database/tweetQueries')
const randomstr = require('randomstring')


describe('[getAllTweets]', () => {
    it('[getAllTweets] should return array of tweets', async () => {
        let result = await tweetQueries.getAllTweets()
        expect(result instanceof Array).toBeTruthy()
    })
})


describe('[getOneTweet]', () => {
    it('[getOneTweet] found tweet, should return tweet object', async () => {
        let result = await tweetQueries.getOneTweet(7)
        expect(result instanceof Object).toBeTruthy()
    })

    it('[getOneTweet] tweet does not exist, should return nothing', async () => {
        let result = await tweetQueries.getOneTweet(4364536543)
        expect(result instanceof Object).toBeFalsy()
    })
})


describe('[postTweet]', () => {
    it('[postTweet] tweet is posted, should return sql result object', async () => {
        let result = await tweetQueries.postTweet("tweet body", 1)
        expect(result instanceof Object).toBeTruthy()
    })

    it('[postTweet] user does not exist, should throw error', async () => {
        await expect(tweetQueries.postTweet("tweet body", 6546544))
            .rejects
            .toThrow('')
    })

    it('[postTweet] string value passed instead of int, should throw error', async () => {
        await expect(tweetQueries.postTweet("tweet body", 'a'))
            .rejects
            .toThrow('')
    })
})


describe('[saveUserTweet]', () => {
    it('[saveUserTweet] tweet is saved, should return sql result object', async () => {
        let result = await tweetQueries.saveUserTweet(1, 7)
        expect(result instanceof Object).toBeTruthy()
    })

    it('[saveUserTweet] user does not exist, should throw error', async () => {
        await expect(tweetQueries.saveUserTweet(432423432, 7))
            .rejects
            .toThrow('')
    })

    it('[saveUserTweet] tweet does not exist, should throw error', async () => {
        await expect(tweetQueries.saveUserTweet(1, 43254542))
            .rejects
            .toThrow('')
    })
})


describe('[retweet]', () => {
    it('[retweet] tweet found  retweet + 1, should return sql result object with changedRows', async () => {
        let result = await tweetQueries.retweet(7, false)
        expect(result.changedRows > 0).toBeTruthy()
    })

    it('[retweet] tweet not found and table not changed, should return sql result object with no changedRows', async () => {
        let result = await tweetQueries.retweet(34324234324, false)
        expect(result.changedRows > 0).toBeFalsy()
    })

    it('[retweet] tweet not found and table not changed, should return sql result object with no changedRows', async () => {
        let result = await tweetQueries.retweet(543543534, "aaa")
        expect(result.changedRows > 0).toBeFalsy()
    })
})


describe('[deleteUserTweet]', () => {
    it('[deleteUserTweet] row found, should return sql result object with affectedRows', async () => {
        let result = await tweetQueries.deleteUserTweet(1, 7)
        expect(result.affectedRows > 0).toBeTruthy()
    })

    it('[deleteUserTweet] userID not found, should return sql result object with no affectedRows', async () => {
        let result = tweetQueries.deleteUserTweet(534543543, 7)
        expect(result.affectedRows > 0).toBeFalsy()
    })

    it('[deleteUserTweet] tweetID not found, should return sql result object with no changedRows', async () => {
        let result = tweetQueries.deleteUserTweet(1, 534543543)
        expect(result.affectedRows > 0).toBeFalsy()
    })
})


describe('[getUserTweets]', () => {
    it('[getUserTweets] userID found, should return array of tweetIDs', async () => {
        let result = await tweetQueries.getUserTweets(1)
        expect(result[0]).toBeTruthy()
    })

    it('[getUserTweets] userID not found, should return empty array', async () => {
        let result = await tweetQueries.getUserTweets(4543534)
        expect(result[0]).toBeFalsy()
    })
})


describe('[getUserTweetsWithRetweets]', () => {
    it('[getUserTweetsWithRetweets] userID found, should return array of tweets] ', async () => {
        let result = await tweetQueries.getUserTweetsWithRetweets(1)
        expect(result[0]).toBeTruthy()
    })

    it('[getUserTweetsWithRetweets] userID found, should return array of tweets] ', async () => {
        let result = await tweetQueries.getUserTweetsWithRetweets(5345643554)
        expect(result[0]).toBeFalsy()
    })
})


describe('[updateTweet]', () => {
    it('[updateTweet] tweetID found, tweet updated', async () => {
        let result = await tweetQueries.updateTweet(randomstr.generate(30), 7)
        expect(result.changedRows > 0).toBeTruthy()
    })

    it('[updateTweet] tweetID found, tweet updated', async () => {
        let result = await tweetQueries.updateTweet(randomstr.generate(30), 435435434)
        expect(result.changedRows > 0).toBeFalsy()
    })
})


describe('[deleteTweet]', () => {
    it('[deleteTweet] userID found, should return sql result object with affected rows', async () => {
        let lastTweet = await tweetQueries.getLastTweetIdTest()
        let result = await tweetQueries.deleteTweet(lastTweet.id)
        expect(result.affectedRows > 0).toBeTruthy()
    })

    it('[deleteTweet] userID not found, should return sql result object with no affected rows', async () => {
        let result = await tweetQueries.deleteTweet(6436546545)
        expect(result.affectedRows > 0).toBeFalsy()
    })
})


describe('[reply]', () => {
    it('[reply] tweetID and replyID found and row inserted, should return sql result object with affectedRows', async () => {
        let result = await tweetQueries.reply(7, 8)
        expect(result.affectedRows > 0).toBeTruthy()
    })

    it('[reply] tweetID and replyID not found and row not inserted, should throw error', async () => {
        await expect(tweetQueries.reply(432432, 43244234))
            .rejects
            .toThrow('')
    })
})


describe('[getReplies]', () => {
    it('[getRepies] tweet id found, should return array of tweets', async () => {
        let result = await tweetQueries.getReplies(1)
        expect(result[0]).toBeTruthy()
    })

    it('[getRepies] tweet id not found, should return empty array', async () => {
        let result = await tweetQueries.getReplies(54354354354)
        expect(result[0]).toBeFalsy()
    })
})