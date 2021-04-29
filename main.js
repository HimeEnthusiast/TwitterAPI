const express = require('express')
const env = require('dotenv').config()
const jwtVerificationMiddleware = require('./src/middleware/jwtVerification')
const app = express()
const port = process.env.EXPRESS_PORT

app.use(express.json()) // Body parser
app.use(function(req, res, next) { // JWT Auth
  jwtVerificationMiddleware(req, res, next)
});

let chat = require('./src/api/chat')
let tweet = require('./src/api/tweet')

// Routers
app.use('/user', require('./src/api/user'))
app.use('/jwt', require('./src/api/jwt'))
app.use('/tweet', tweet.router)
app.use('/chat', chat.router)

app.get('/', (req, res) => {
  res.send('Hello Twitter!')
})

// Runs when jest tests aren't active
if (process.env.JEST_WORKER_ID == undefined) {
  app.listen(port, () => {
    console.log(`Twitter app listening at http://localhost:${port}`)
  })
}

module.exports = app