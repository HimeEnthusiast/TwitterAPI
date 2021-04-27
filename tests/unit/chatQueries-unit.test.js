const app = require('../../main')
const request = require('supertest')
const chatQueries = require('../../database/chatQueries')

it('[getConversation] should return conversation object', async () => {
    let result = await chatQueries.getConversation(1, 2)
    expect(result).toBeTruthy()
})

it('[createConversation] conversation created, should return sql result object', async () => {
    let result = await chatQueries.createConversation(1, 2)
    expect(result instanceof Object).toBeTruthy()
})

it('[createConversation] string inserted instead of numbers, should throw error', async () => {
    await expect(chatQueries.createConversation('a', 'b'))
        .rejects
        .toThrow('')
})

it('[sendMessage] message sent, should return sql result object', async () => {
    let result = await chatQueries.sendMessage("Message", 1, 1)
    expect(result instanceof Object).toBeTruthy()
})

it('[sendMessage] user does not exist, should throw error', async () => {
    await expect(chatQueries.sendMessage("Message", 654654654, 1))
        .rejects
        .toThrow('')
})

it('[sendMessage] conversation does not exist, should throw error', async () => {
    await expect(chatQueries.sendMessage("Message", 1, 654654654))
        .rejects
        .toThrow('')
})

it('[getConversationMessages] conversation found, should return array', async () => {
    let result = await chatQueries.getConversationMessages(1)
    expect(result).toBeTruthy()
})

it('[getConversationMessages] conversation does not exist, should return nothing', async () => {
    let result = await chatQueries.getConversationMessages('a')
    expect(result[0]).toBeFalsy()
})