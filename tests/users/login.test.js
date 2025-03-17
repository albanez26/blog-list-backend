const mongoose = require('mongoose')
const { test, beforeEach, after } = require('node:test')
const User = require('../../models/user')
const app = require('../../app')
const supertest = require('supertest')

const api = supertest(app)

beforeEach(async () => {
  await User.findOneAndDelete({ username: 'root' })
  const user = {
    name: 'admin',
    username: 'root',
    password: 's3cr3t'
  }
  await api
    .post('/api/users')
    .send(user)
})

test('Login', async () => {
  const { body } = await api.post('/api/login')
    .send({
      username: 'root',
      password: 's3cr3t'
    })
    .expect(200)
  console.log(body.token)
})

after(async () => {
  await mongoose.connection.close()
})