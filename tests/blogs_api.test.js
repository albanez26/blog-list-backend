const { test, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const app = require('../app')
const helper = require('./tests_helper')
const assert = require('node:assert')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('id property is defined', async () => {
  const { body } = await api.get('/api/blogs')
  assert(body.every(blog => 'id' in blog))
})

test('a blog is created correctly', async () => {
  const initialBlogs = await helper.blogsInDb()
  const { body } = await api
    .post('/api/login')
    .send({
      username: 'albanez26',
      password: 'Admin123'
    })
    .expect(200)

  helper.token = body.token
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  }
  const { body: createdBlog } = await api
    .post('/api/blogs')
    .set({ authorization: `Bearer ${helper.token}` })
    .send(blog)
    .expect(201)

  const currentBlogs = await helper.blogsInDb()

  assert.strictEqual(initialBlogs.length + 1, currentBlogs.length)
  assert(currentBlogs.some(blog => blog.title === createdBlog.title))
})

test('likes default is zero', async () => {
  const newBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
  }
  const { body } = await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ authorization: `Bearer ${helper.token}` })
    .expect(201)
  assert.strictEqual(body.likes, 0)
})

test('title and url are defined', async () => {
  const blog = {
    author: 'Michael Chan',
    likes: 7
  }
  await api
    .post('/api/blogs')
    .send(blog)
    .set({ authorization: `Bearer ${helper.token}` })
    .expect(400)
})

test('successfully delete a blog', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  }
  const { body: createdBlog } = await api
    .post('/api/blogs')
    .set({ authorization: `Bearer ${helper.token}` })
    .send(blog)
    .expect(201)

  const blogsAtStart = await helper.blogsInDb()
  await api
    .delete(`/api/blogs/${createdBlog.id}`)
    .set({ Authorization: `Bearer ${helper.token}` })
    .expect(204)

  const currentBlogs = await helper.blogsInDb()
  assert.strictEqual(blogsAtStart.length - 1, currentBlogs.length)
})

test('update the number of likes', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  }
  const { body: createdBlog } = await api
    .post('/api/blogs')
    .set({ authorization: `Bearer ${helper.token}` })
    .send(blog)
    .expect(201)

  const { body: updatedBlog } = await api
    .put(`/api/blogs/${createdBlog.id}`)
    .set({ authorization: `Bearer ${helper.token}` })
    .send({ ...createdBlog, likes: 20 })
    .expect(200)

  assert((createdBlog.likes !== updatedBlog.likes) && updatedBlog.likes === 20)
})

after(async () => {
  await mongoose.connection.close()
})