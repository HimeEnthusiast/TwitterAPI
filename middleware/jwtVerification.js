const jwt = require('jsonwebtoken')

const requireJWTRoutes = [
    { path: "/tweet", get: false, post: true, put: true, delete: true },
    { path: "/jwt/login", post: false },
    { path: "/users", post: false },
    { path: "/chat", get: true, post: true }
]


function jwtVerificationMiddleware(req, res, next) {
    let accessResponse = false
    const url = new URL('http://localhost' + req.url)
    console.log(url)
    try {
        accessResponse = verifyRestMethodAccess(req.method, url.pathname)
    } catch (e) {
        res.status(404).send({ message: 'Not found.' })
    }

    if (accessResponse) {
        const header = req.headers['authorization']

        if (header !== undefined) {
            const bearer = header.split(' ')
            const token = bearer[1]
            req.token = token
        }

        jwt.verify(req.token, 'secretkey', async (err, data) => {
            if (err) {
                res.status(401).send({ message: 'jwt determined invalid' })
            } else {
                req.body["user"] = data
                next()
            }
        })
    } else {
        next()
    }
}


function verifyRestMethodAccess(restMethod, url) {
    // Find path settings for incoming request path
    // EX: /tweet/1 -> find "/tweet" settings
    const pathSettings = requireJWTRoutes.find(
        x => url.search(x.path) !== -1
    )
    // Determine if REST method & path requires JWT token for access
    switch (restMethod) {
        case "GET": {
            return pathSettings.get
        }
        case "POST": {
            return pathSettings.post
        }
        case "PUT": {
            return pathSettings.put
        }
        case "DELETE": {
            return pathSettings.delete
        }
        default: {
            return false
        }
    }
}

module.exports = jwtVerificationMiddleware