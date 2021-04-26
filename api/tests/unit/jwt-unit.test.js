const app = require('../../../main')
const request = require('supertest')
const randomstr = require('randomstring')

// it('should return 401', async () => {
    
// })

// it('should return 401', async () => {
    
// })

it('should return 200', async () => {
    await request(app)
        .post('/jwt/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'user',
          password: 'pass'
        })
        .expect(200)
        
});