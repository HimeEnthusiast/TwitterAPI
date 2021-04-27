const app = require('../../main')
const userQueries = require('../../database/userQueries')
const request = require('supertest')
const randomstr = require('randomstring')

it('[getAllUsers] should return array of users', async () => {
    let result = await userQueries.getAllUsers()
    expect(result).toBeTruthy()
})

it('[getOneUserById] userId exists, should return user object', async () => {
    let result = await userQueries.getOneUserById(1)
    expect(result).toBeTruthy()
})

it('[getOneUserById] userId does not exist, should return nothing', async () => {
    let result = await userQueries.getOneUserById(5436547657356)
    expect(result).toBeFalsy()
})

it('[getOneByUsername] username exists, should return user object', async () => {
    let result = await userQueries.getOneUserByUsername("user")
    expect(result).toBeTruthy()
})

it('[getOneByUsername] username does not exist, should return nothing', async () => {
    let result = await userQueries.getOneUserByUsername(randomstr.generate(10))
    expect(result).toBeFalsy()
})

it('[insertOneUser] username is unique, should return sql result object', async () => {
    let result = await userQueries.insertOneUser(randomstr.generate(10), "pass")
    expect(result).toBeTruthy()
})

it('[insertOneUser] username already exists, should throw error', async () => {
    await expect(userQueries.insertOneUser("user", "pass"))
        .rejects
        .toThrow('')
})