const app = require('../../main')
const request = require('supertest')
const randomstr = require('randomstring')


let server = null;

beforeEach(() => {
  server = app.listen(3000, () => console.log('Listening on port 3000'));
})

afterEach(async () => {
  await server.close();
})


it('POST[/users/] registration failed user exists, should return 409', async () => {
  await request(app)
    .post('/user/')
    .send({
      username: 'user',
      password: 'pass'
    })
    .expect(409)
})

it('POST[/users/] registration with new username successful, should return 200', async () => {
  await request(app)
    .post('/user/')
    .send({
      username: randomstr.generate(10),
      password: 'pass'
    })
    .expect(200)
})