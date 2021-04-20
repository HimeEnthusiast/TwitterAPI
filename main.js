const express = require('express')
const jwtVerificationMiddleware = require('./middleware/jwtVerification')
const app = express()
const port = 3000

app.use(express.json()) // Body parser
app.use(function(req, res, next) { // JWT Auth
  jwtVerificationMiddleware(req, res, next)
});

// Routers
app.use('/users', require('./api/users'))
app.use('/jwt', require('./api/jwt'))
app.use('/tweet', require('./api/tweet'))
app.use('/chat', require('./api/chat'))

app.get('/', (req, res) => {
  res.send('Hello Twitter!')
})

// Boot message
app.listen(port, () => {
  console.log(`Twitter app listening at http://localhost:${port}`)
})