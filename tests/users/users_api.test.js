const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const helper = require('../../tests/tests_helper')
const supertest = require('supertest')
const app = require('../../app')
const User = require('../../models/user')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach( async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

test('Password has the correct length', async () => {
  const invalidUser = { ...helper.initialUsers[0], password: '12' }
  const usersAtStart = await helper.usersInDb()
  const response = await api
    .post('/api/users')
    .send(invalidUser)
    .expect(400)

  const usersAtEnd = await helper.usersInDb()
  assert(response.body.error.includes('Password must have at least 3 characters'))
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('User successfully created', async () => {
  const usersAtStart = await helper.usersInDb()
  const user = {
    name: 'Alejandra Albanez',
    username: 'ale2018',
    password: 'pa55w0rd'
  }
  const { body: createdUser } = await api.post('/api/users')
    .send(user)
    .expect(201)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)
  assert(usersAtEnd.find(user => user.username === createdUser.username))
})

test('Cannot create a repeated user', async () => {
  const usersAtStart = await helper.usersInDb()
  const response = await api
    .post('/api/users')
    .send({ ...helper.initialUsers[0], password: '123' })
    .expect(409)

  const usersAtEnd = await helper.usersInDb()
  assert(response.body.error.includes('username already registered'))
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after( async () => {
  await mongoose.connection.close()
})


