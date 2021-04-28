/** @module jwtVerificationMiddleware */
const jwt = require('jsonwebtoken')

/**
 * A collection of all routes and their REST methods. True means must be authenticated, false means it doesn't need it.
 */
const requireJWTRoutes = [
    { path: "/tweet", get: false, post: true, put: true, delete: true },
    { path: "/jwt", post: false },
    { path: "/users", post: false },
    { path: "/chat", get: true, post: true }
]

/**
 * jwtVerificationMiddleware
 * @description - Determines if the route is to be authenticated, then verifies token if needed.
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @param {Function} next - Move onto next middleware
 */
function jwtVerificationMiddleware(req, res, next) {
    let accessResponse = false
    const url = new URL('http://localhost' + req.url)
    try {
        accessResponse = verifyRestMethodAccess(req.method, url.pathname)
    } catch (e) {
        // Will return a 404 is the URL is not registered/doesn't exist
        res.status(404).send({ message: 'Not found.' })
    }

    // If true, the route will be require an Authorization header with JWT token
    if (accessResponse) {
        const header = req.headers['authorization']

        if (header !== undefined) {
            const bearer = header.split(' ')
            const token = bearer[1]
            req.token = token
        }

        jwt.verify(req.token, process.env.JWT_SECRET, async (err, data) => {
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

/**
 * verifyResMethodAccess
 * @description - Takes in the REST method and URL to determine if they are to be authenticated.
 * @param {String} restMethod 
 * @param {URL} url 
 * @returns {Boolean} - Returns the REST method boolean of the specificed url from the requireJWTRoutes object based on current REST method being used. 
 */
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