const app = require('../../main')
const request = require('supertest')


it('POST[/jwt/login] correct user information sent, should return 200', async () => {
    await request(app)
        .post('/jwt/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'usergfdgdf',
          password: 'pass'
        })
        .expect(200)
})

it('POST[/jwt/login] incorrect password sent, should return 401', async () => {
  await request(app)
      .post('/jwt/login')
      .set('Content-Type', 'application/json')
      .send({
        username: 'usergfdgdf',
        password: 'rertrtet'
      })
      .expect(401)
})

it('POST[/jwt/login] incorrect username sent, should return 401', async () => {
  await request(app)
      .post('/jwt/login')
      .set('Content-Type', 'application/json')
      .send({
        username: 'tdfterter',
        password: 'pass'
      })
      .expect(401)
})