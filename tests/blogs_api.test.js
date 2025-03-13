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
  const blog = {
    title: 'new blog',
    author: 'Edwin Albanez',
    url: 'blog url',
    likes: 10
  }
  const { body } = await api.post('/api/blogs').send(blog)
  const currentBlogs = await helper.blogsInDb()

  assert.strictEqual(initialBlogs.length + 1, currentBlogs.length)
  assert(currentBlogs.some(blog => blog.title === body.title))
})

test('likes default is zero', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'new author',
    url: 'new url'
  }
  const { body } = await api.post('/api/blogs').send(newBlog)
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
    .expect(400)
})

after(() => {
  mongoose.connection.close()
})